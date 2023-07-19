export const getLogs = async (req, res) => {
   req.logger.error("Error");
   req.logger.warn("Warn");
   req.logger.info("Info");
   req.logger.http("Http");
   req.logger.debug("Debug");
   req.logger.fatal("Fatal");
   return res.send("Prueba de logger")
}