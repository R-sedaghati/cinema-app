/**
 * The purchase route that will redirect the user to the payment gateway
 */

import { getPaymentDriver } from "monopay";
import { User } from "../../entities/User.js";
import { CustomRequest } from "../../types/controllers.types.js";
import { configs } from "../../config/configs.js";
import { apiResponse } from "../../utils/customResponse.js";
import { Response } from "express";
import { artistRequestRepository, paymentRepository } from "../../models/index.js";
import { ArtistRequestStatus, PaymentStatus } from "../../utils/enum.js";

export const purchaseController = async (req: CustomRequest<{ user: User }>, res: Response) => {
    const { amount, requestId } = req.query
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        return apiResponse(res, {
            success: false,
            message: 'مبلغ نامعتبر است. لطفاً یک مبلغ مثبت وارد کنید.',
            statusCode: 400,
        });
    }
    

    try{
        const driver = getPaymentDriver("zarinpal")({
            merchantId: configs.gatewayConfiguration.merchantId, 
            sandbox: configs.gatewayConfiguration.sandbox 
        });

        const paymentInfo = await driver.request({
            amount: Number(amount),
            callbackUrl: configs.appUrl + '/purchase/callback/?requestId=' + requestId,
        });

        await paymentRepository().save({
            paymentId: String(paymentInfo.referenceId),
            amount: Number(amount),
            paymentGateway: "zarinpal",
            artistRequest: { id: Number(requestId) }
        });

        res.send(`<html>
            <body>
                <h1> We're redirecting you to the payment gateway... </h1>
                <script>${paymentInfo.getScript()}</script>
            </body>
            </html>`
        );        
    } catch (e) {
        return apiResponse(res, {
            success: false,
            message: 'خطا در اتصال به درگاه پرداخت. لطفاً دوباره تلاش کنید.',
            statusCode: 500,
        });
    }

}


/**
 * The callback URL that was given to `request`
 */
export const callbackController = async (req: CustomRequest<{ user: User }>, res: Response) => {
    if (req.query.Status === "OK") {
        try {
            const requestId = req.query.requestId;
            const driver = getPaymentDriver("zarinpal")({
                merchantId: configs.gatewayConfiguration.merchantId, 
                sandbox: configs.gatewayConfiguration.sandbox 
            });
            
            const paymentObject = await paymentRepository().find({
                where: { artistRequest: { id: Number(requestId) } },
                order: { id: "DESC" },
                take: 1
            })
            const payment = paymentObject[0]
            const receipt = await driver.verify(
            {
                amount: payment.amount,
            },
            { ...req.query, ...req.body },
            );

            payment.status = PaymentStatus.COMPLETED;
            await paymentRepository().save(payment);
            payment.artistRequest.status = ArtistRequestStatus.PENDING;
            await artistRequestRepository().save(payment.artistRequest);


            return apiResponse(res, {
                success: true,
                message: 'پرداخت با موفقیت انجام شد.',
                data: {
                    transactionId: receipt.transactionId, // Is probably null if you're using sandbox
                },
                statusCode: 200,
            });
        } catch (e) {
            return apiResponse(res, {
                success: false,
                message: 'پرداخت ناموفق بود. لطفاً دوباره تلاش کنید.',
                statusCode: 400,
            });
        }
    } else {
        return apiResponse(res, {
            success: false,
            message: 'پرداخت ناموفق بود یا توسط کاربر لغو شد.',
            statusCode: 400,
        });
    }
}