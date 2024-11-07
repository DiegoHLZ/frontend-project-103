### Hexlet tests and linter status

[![Actions Status](https://github.com/DiegoHLZ/frontend-project-103/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/DiegoHLZ/frontend-project-103/actions)

# Gendiff

Gendiff es una herramienta CLI que compara dos archivos de configuración y muestra sus diferencias. Es compatible con archivos en formato JSON y YAML.

## Características

- Compara archivos JSON y YAML.
- Muestra las diferencias en un formato legible.
- Fácil de usar y configurar.

## Instalación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/DiegoHLZ/frontend-project-103.git
    ```
2. Navega al directorio del proyecto:
    ```bash
    cd frontend-project-103
    ```
3. Instala las dependencias:
    ```bash
    npm install
    ```
4. Para usar el comando `gendiff`, asegúrate de que tenga permisos de ejecución:
    ```bash
    chmod +x gendiff.mjs
    ```

## Uso

Puedes ejecutar la herramienta con el siguiente comando:
```bash
node gendiff.mjs __fixtures__/file1.yml __fixtures__/file2.yml 
```

## Ejemplo en video

Mira el siguiente video para ver cómo funciona `gendiff` en acción:

[![asciinema](https://asciinema.org/a/pELEEf9xQeFLgTrDqub0mlc6g.png)](https://asciinema.org/a/pELEEf9xQeFLgTrDqub0mlc6g)