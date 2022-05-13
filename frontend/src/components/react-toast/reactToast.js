import { toast } from 'react-toastify';

const notify = (msg) => ({
    error() {
        toast.error(msg, {
            position: toast.POSITION.BOTTOM_CENTER,
        });
    },
    success() {
        toast.success(msg, {
            position: toast.POSITION.BOTTOM_CENTER,
        });
    },
});
export default notify;
