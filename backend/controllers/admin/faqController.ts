import { Request, Response } from "express";
import { paginate } from "../../utils/pagination.js";
import { faqRepository } from "../../models/index.js";
import { apiResponse } from "../../utils/customResponse.js";
import { FAQ } from "../../entities/FAQ.js";

export const faqListController = async (req: Request, res: Response) => {
    const {data, meta} = await paginate({
        repository: faqRepository(),
        req
    })

    return apiResponse(res, {
        data,
        pagination: {...meta}
    })
}

export const faqRetrieveController = async (req: Request, res: Response) => {
    const {id} = req.params;
    const faq = await faqRepository().findOne({
        where: {id: Number(id)}
    })

    if (!faq) {
        return apiResponse(res, {
            message: 'no faq found!',
            statusCode: 400
        })
    }

    return apiResponse(res, {
        data: faq
    })
}

export const faqUpdateController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { question, answer } = req.body;

    const faq = await faqRepository().findOne({
        where: {id: Number(id)}
    })

    if (!faq) {
        return apiResponse(res, {
            message: 'no faq found!',
            statusCode: 400
        })
    }

    if (question !== undefined) {
        faq.question = question
    }
    if (answer !== undefined) {
        faq.answer = answer
    }

    const data = await faqRepository().save(faq)

    return apiResponse(res, {
        data
    })
}

export const faqCreateController = async (req: Request, res: Response) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return apiResponse(res, {
      message: 'question and answer are required!',
      statusCode: 400,
    });
  }

  const faq = faqRepository().create({ question, answer });
  const data = await faqRepository().save(faq);

  return apiResponse(res, {
    statusCode: 201,
    data,
  });
};


export const updateAdminFAQsController = async (req: Request, res: Response) => {
  try {
    const faqs: { id: number; question?: string; answer?: string }[] = req.body;

    if (!Array.isArray(faqs) || faqs.length === 0) {
      return apiResponse(res, {
        statusCode: 400,
        success: false,
        message: "Body must be a non-empty array of FAQ objects",
      });
    }

    const queryRunner = faqRepository().manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedFaqs = [];

      for (const item of faqs) {
        if (!item.id) {
          throw new Error("Each FAQ object must have an id");
        }

        const faq = await queryRunner.manager.findOne(FAQ, {
          where: { id: item.id },
          lock: { mode: "pessimistic_write" },
        });

        if (!faq) {
          throw new Error(`FAQ with id ${item.id} not found`);
        }

        // partial update — only overwrite fields that are provided
        if (item.question !== undefined) faq.question = item.question;
        if (item.answer !== undefined) faq.answer = item.answer;

        const saved = await queryRunner.manager.save(FAQ, faq);

        updatedFaqs.push({
          id: saved.id,
          question: saved.question,
          answer: saved.answer,
        });
      }

      await queryRunner.commitTransaction();

      return apiResponse(res, {
        statusCode: 200,
        success: true,
        message: "FAQs updated successfully",
        data: updatedFaqs,
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    console.error("Error updating FAQs:", error);
    return apiResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to update FAQs",
      errors: error instanceof Error ? error.message : "Unknown error",
    });
  }
};