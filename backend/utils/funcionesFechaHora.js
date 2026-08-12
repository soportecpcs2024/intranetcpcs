const obtenerFechaDeHoy = () => {
    try {
        const ahora = new Date();

        // 1. Validar que el reloj del sistema operativo del servidor esté respondiendo correctamente
        if (isNaN(ahora.getTime())) {
            throw new Error("El reloj del servidor devolvió un valor de tiempo inválido.");
        }

        const fechaColombia = ahora.toLocaleString("en-US", { timeZone: "America/Bogota" });
        const componentes = new Date(fechaColombia);

        // 2. Validar que la conversión de Zona Horaria no haya corrompido los datos
        if (isNaN(componentes.getTime())) {
            throw new Error("Error crítico al procesar la zona horaria 'America/Bogota'.");
        }

        // 3. Crear el objeto a Hora Cero UTC
        const hoyHoraCero = new Date(Date.UTC(
            componentes.getFullYear(),
            componentes.getMonth(),
            componentes.getDate(),
            0, 0, 0, 0
        ));

        // 4. Seguridad de Negocio: Validar que la fecha procesada no sea mayor a la real actual + 1 día (por desfases de huso horario extremo)
        const limiteMaximo = new Date();
        limiteMaximo.setDate(limiteMaximo.getDate() + 1);
        if (hoyHoraCero > limiteMaximo) {
            throw new Error("Seguridad: Intento de registrar una fecha en el futuro lejano.");
        }

        // Devolver el objeto listo
        return hoyHoraCero;

    } catch (error) {
        // En lugar de que el servidor se caiga (Crash), registramos el error en la consola
        console.error("⛔ [ERROR EN OBTENER_FECHA]:", error.message);

        // Devolvemos un respaldo de emergencia basado en la fecha de hoy UTC pura para que el sistema siga operando
        const emergenciaUTC = new Date();
        emergenciaUTC.setUTCHours(0, 0, 0, 0);
        return emergenciaUTC;
    }
}

const obtenerHora = () => {
    const fecha = new Date();
    const formato = fecha.toLocaleString("en-US", { timeZone: "America/Bogota" });
    const fechaColombia = new Date(formato);
    const hora = fechaColombia.getHours();
    return hora;
}

module.exports = {obtenerFechaDeHoy, obtenerHora}