import chalk from 'chalk';
import AlertServices from '../services/alertServices';

// https://stackoverflow.com/questions/49047259/how-to-parse-graphql-request-string-into-an-object
// import { parse } from 'graphql';
// console.log(parse(req.body.query).definitions[0].selectionSet.selections[0]);
export const getAlerts = async (args: any, req: any) => {
    const userId = req.authData.id;

    const alerts = await AlertServices.listUserAlerts(userId);
    if (process.env.MONKE_DEBUG === 'true') {
        console.log(`User ${chalk.blue(userId)} listed alerts`);
    }
    return alerts;
};

export const getSingleAlert = async (args: any, req: any) => {
    const userId = req.authData.id;
    const alertId = args.id;

    const alert = await AlertServices.findById(alertId, userId);
    if (process.env.MONKE_DEBUG === 'true') {
        console.log(
            `User ${chalk.blue(userId)} listed alert for ${chalk.green(alert.product.title)}`
        );
    }
    return alert;
};

export const createAlert = async (args: any, req: any) => {
    const userId = req.authData.id;
    const { url, targetPrice } = args;

    const alert = await AlertServices.createAlert({ url, targetPrice }, userId);
    if (process.env.MONKE_DEBUG === 'true') {
        console.log(
            `User ${chalk.blue(userId)} created alert for ${chalk.green(alert.product.title)}`
        );
    }
    return alert;
};

export const editAlert = async (args: any, req: any) => {
    const userId = req.authData.id;
    const alertId = args.id;
    const targetPrice = args.newPrice;
    const title = args.newTitle;

    const alert = await AlertServices.editAlert(alertId, title, targetPrice, userId);
    if (process.env.MONKE_DEBUG === 'true') {
        console.log(
            `User ${chalk.blue(userId)} edited alert for ${chalk.green(alert.product.title)}`
        );
    }
    return alert;
};

export const deleteAlert = async (args: any, req: any) => {
    const userId = req.authData.id;
    const alertId = args.id;

    const alert = await AlertServices.deleteAlert(alertId, userId);
    if (process.env.MONKE_DEBUG === 'true') {
        console.log(
            `User ${chalk.blue(userId)} deleted the alert for ${chalk.red(alert.product.title)}`
        );
    }
    return alert;
};
