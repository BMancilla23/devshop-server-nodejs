## Generar secret key con OpenSSL

```bash
openssl rand -base64 32
```

_Explicación_

**openssl rand:** Genera bytes aleatorios.

**-base64:** Codifica la salida en base64, lo que hace que sea más fácil de usar y almacenar como una cadena.

**32:** El número de bytes que quieres generar (en este caso, 32 bytes es un tamaño típico para una clave secreta segura). La clave resultante tendrá una longitud de 256 bits, lo que es suficiente para la mayoría de los casos de uso de JWT.
