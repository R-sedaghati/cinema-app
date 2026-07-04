import { Request, Response } from "express";
import iranCity from "iran-city";
import { apiResponse } from "../../utils/customResponse.js";

export const getProvincesController = async (req: Request, res: Response) => {
  try {
    const provinces = iranCity.allProvinces();

    return apiResponse(res, {
      statusCode: 200,
      success: true,
      data: provinces,
    });
  } catch (error) {
    return apiResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch provinces",
      errors: error,
    });
  }
};

export const getProvinceCitiesController = async (req: Request, res: Response) => {
  try {
    const provinceId = Number(req.params.id);

    if (!provinceId || Number.isNaN(provinceId)) {
      return apiResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid province id",
      });
    }

    const cities = iranCity.citiesOfProvince(provinceId);

    if (!cities || cities.length === 0) {
      return apiResponse(res, {
        statusCode: 404,
        success: false,
        message: "Province not found or has no cities",
      });
    }

    return apiResponse(res, {
      statusCode: 200,
      success: true,
      data: cities,
    });
  } catch (error) {
    return apiResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch cities",
      errors: error,
    });
  }
};

export const searchCitiesController = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return apiResponse(res, {
        statusCode: 400,
        success: false,
        message: "Query parameter 'q' is required",
      });
    }

    const results = iranCity.searchByName(q);

    return apiResponse(res, {
      statusCode: 200,
      success: true,
      data: results,
    });
  } catch (error) {
    return apiResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to search cities",
      errors: error,
    });
  }
};

export const getCityByIdController = async (req: Request, res: Response) => {
  try {
    const cityId = Number(req.params.id);

    if (!cityId || Number.isNaN(cityId)) {
      return apiResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid city id",
      });
    }

    const city = iranCity.cityById(cityId);

    if (!city) {
      return apiResponse(res, {
        statusCode: 404,
        success: false,
        message: "City not found",
      });
    }

    return apiResponse(res, {
      statusCode: 200,
      success: true,
      data: city,
    });
  } catch (error) {
    return apiResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch city",
      errors: error,
    });
  }
};