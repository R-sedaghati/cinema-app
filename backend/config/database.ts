import AppDataSource from "../data-source.js";

export const dbConnection = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};

export { AppDataSource };