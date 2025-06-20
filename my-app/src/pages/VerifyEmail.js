import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function VerifyEmail() {
  const [status, setStatus] = useState('Verifying...');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setStatus('Missing verification token.');
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/verify-email?token=${token}&email=${email}`);
        if (response.redirected) {
          window.location.href = response.url;
        } else {
          const data = await response.json();
          setStatus(data.message || 'Verification failed.');
        }
      } catch (err) {
        console.error('Verification failed:', err);
        setStatus('An error occurred.');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen text-lg font-semibold text-gray-700">
      {status}
    </div>
  );
}

export default VerifyEmail;
