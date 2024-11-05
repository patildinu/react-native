import axios from 'axios';

export const validateDeliveryPerson = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Sending request with:", email, password);
  
      const response = await axios.post(
        'https://5kyldkgrz9.execute-api.us-east-1.amazonaws.com/devStage/postValidateUser',
        {
          body: [{ email, password }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      // console.log("API Response:", response.data);
  
  
      if (response.data && response.data.body && response.data.body.exists === true) {
        return true;
      } else {
        console.error("Login Failed: Incorrect email or password.");
        return false;
      }
    } catch (error) {
      console.error("API Error Details:", error.response ? error.response.data : error);
      return false;
    }
  };
  
  
export const postUserInfo = async (email, password) => {
    try {
      const response = await fetch('https://sq8qt1eft9.execute-api.us-east-1.amazonaws.com/devStage/postUserInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: [
            {
              email: email,
              password: password,
            },
          ],
        }),
      });
  
      const data = await response.json();
    //   console.log('API Response:', data); 
  
      // Check if the response contains a success indicator
      if (data && data.success) {  
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error signing up:', error);
      return false;
    }
  };
  