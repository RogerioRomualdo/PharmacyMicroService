import { Server } from "@grpc/grpc-js";
import { PharmacyController } from "../../core/controllers/pharmacy/PharmacyController";
import { PharmacyService } from "../../core/services/pharmacy/PharmacyService";
import { PharmacyRepository } from "../../core/repositories/pharmacy/PharmacyRepository";

const pharmacyRepository = new PharmacyRepository();
const pharmacyService = new PharmacyService(pharmacyRepository);
const pharmacyController = new PharmacyController(pharmacyService);

export default (server: Server, proto: any) => {
  server.addService(proto, pharmacyController as any);
};
