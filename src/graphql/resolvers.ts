import AlertServices from '../services/alertServices';

export const getAlerts = async (args, req) => {
    // https://stackoverflow.com/questions/49047259/how-to-parse-graphql-request-string-into-an-object
    // import { parse } from 'graphql';
    // console.log(parse(req.body.query).definitions[0].selectionSet.selections[0]);

    const userId = req.authData.id;

    const alerts = await AlertServices.listUserAlerts(userId);
    return alerts;
};

export const getSingleAlert = async (args, req) => {
    // TODO: prevent other user from accessing
    const alertId = args.id;

    const alert = await AlertServices.findById(alertId);

    return alert;
};

export const createAlert = async (args, req) => {
    console.log('hello');
    const userId = req.authData.id;
    const { url, targetPrice } = args.alertData;

    const alert = await AlertServices.createAlert({ url, targetPrice }, userId);
    console.log(alert);
    return alert;
};
