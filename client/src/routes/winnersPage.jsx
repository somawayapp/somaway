import React, { useEffect, useState } from "react";

const Winners = () => {
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {

    fetch("https://somawayapi.vercel.app/mpesa/cycle-status")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setWinner(data.winner);
        else setError("No winner yet");
      })
      .catch(() => setError("Failed to load winner"));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4">🎉 Winner of the Cycle</h1>
      {error && <p className="text-red-500">{error}</p>}
      {winner ? (
        <div className="bg-gray-900 p-6 rounded-md space-y-2 border border-gray-700">
          <p><strong>Name:</strong> {winner.name}</p>
          <p><strong>Phone:</strong> {winner.phone}</p>
          <p><strong>Amount:</strong> {winner.amount} KES</p>
          <p><strong>Cycle:</strong> {winner.cycle}</p>
          <p><strong>MPESA Receipt:</strong> {winner.mpesaReceiptNumber}</p>
          <p><strong>Transaction ID:</strong> {winner.transactionId}</p>
          <p className="text-sm text-gray-400 break-all">
            <strong>Public Seed:</strong> {winner.publicRandomSeed}
          </p>
        </div>
      ) : (
        !error && <p className="text-gray-400">Loading winner details...</p>
      )}
    </div>
  );
};

export default Winners;
