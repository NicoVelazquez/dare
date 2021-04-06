## Install

    $ git clone https://github.com/NicoVelazquez/dare.git
    $ cd dare
    $ npm install

## Configurations

Create file `.env` and include the following variables.

```
    INSURANCE_API_CLIENT_ID
    INSURANCE_API_CLIENT_SECRET
    INSURANCE_API_BASE_URL
    JWT_ENCRYPTION
```

Edit development, production and testing configuration files in `./config` 

```
    port
    JWT_EXPIRATION
```

## Run in dev mode

    $ npm run dev

## Run tests

    $ npm run test
