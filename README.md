# Pharmacy Micro Service

<h4 align='right'>
    <i>
        Timespan: 28/01/2022 - 01/02/2022
    </i>
</h4>

### Especifications for the challenge can be found <a href=https://github.com/pedidopago/nodejs-challenge>here<a>

## About

This pharmacy Micro Service manages Pharmacies and it's Subsidiaries while communicating with the <a href=https://github.com/RogerioRomualdo/ProductMicroService>Product Micro Service<a> via **GRPC** and a <a href=https://github.com/RogerioRomualdo/PedidoPagoCodeChallengeAPI>**REST** API<a> in order to create a more user-friendly interface

### Technologies and Stratagies

- **Docker** - Set up in a container under the same network as the products micro service
- **GRPC** - For communication with the aforementioned micro service and with a **REST** API
- **Typescript** - Type checking resulting in a more reliable code
- Unit testing with **Jest**
- **TDD** as the chosen design pattern
- **TypeORM** as the chosen ORM because of it's integration with typescript
