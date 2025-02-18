import {useEffect, useState} from "react";
import {api} from "../../API/api";

export const PaymentProofModal = ({
  isOpen,
  closeModal,
  selectedTransaction,
}) => {
  const [paymentProof, setPaymentProof] = useState("");

  const fetchPaymentProof = async (transactionId) => {
    try {
      const response = await api.get(`/order/${transactionId}/payment-proof`);
      const {payment_proof} = response.data;
      setPaymentProof(payment_proof);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isOpen && selectedTransaction) {
      fetchPaymentProof(selectedTransaction);
    }
  }, [isOpen, selectedTransaction]);

  const handleOverlayClick = (e) => {
    const isModalContentClicked = e.target.closest(".modal-content");
    if (!isModalContentClicked) {
      closeModal();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div
              className="modal-overlay fixed inset-0 bg-black opacity-50"
              onClick={handleOverlayClick}></div>
            <div className="bg-white rounded-lg shadow-sm max-w-sm mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="modal-header bg-gray-200 rounded-t-lg py-3 px-6">
                <h2 className="text-xl font-bold">Payment Proof</h2>
              </div>
              <div className="modal-body p-6 overflow-y-auto max-h-96">
                <img
                  src={paymentProof}
                  alt="Payment Proof"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
