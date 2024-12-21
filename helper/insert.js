import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function insertNewDevice(sensorName, deviceId, type) {
  try {
    const sensor = await prisma.sensor.upsert({
      where: { sensorName },
      update: {
        deviceId,
        type,
      },
      create: {
        sensorName,
        deviceId,
        type,
      },
    });
    console.log("Sensor hinzugefügt oder aktualisiert:", sensor);
  } catch (error) {
    console.error("Fehler beim Hinzufügen/Aktualisieren des Sensors:", error);
  }
}

async function insertNewDatapoint(sensorName, value) {
  const strValue = String(value);
  try { 
   const measurement = await prisma.measurement.create({
      data: {
        sensorName,
        sensorValue: strValue,
      },
    });
    console.log("Messwert hinzugefügt:", measurement);
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Messwerts:", error);
  }
}

export { insertNewDevice, insertNewDatapoint };
