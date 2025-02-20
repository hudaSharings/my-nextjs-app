import client from './schema/client';
import shift from './schema/shift';
import shiftSplit from './schema/shiftSplit';
import { user} from './schema/users';
export const tables = {
    users: user,
    clients: client,
    shifts:shift,
    shiftSplits:shiftSplit
}

export default tables