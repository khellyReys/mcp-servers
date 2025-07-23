/**
 * Function to retrieve AdAccount details from the Marketing API.
 *
 * @param {Object} args - Arguments for retrieving AdAccount details.
 * @param {string} args.account_id - The ID of the AdAccount to retrieve details for.
 * @param {string} [args.base_url='https://graph.facebook.com/v12.0'] - The base URL for the Marketing API.
 * @returns {Promise<Object>} - The details of the AdAccount.
 */
const executeFunction = async ({ account_id, base_url = 'https://graph.facebook.com/v12.0' }) => {
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${base_url}/act_${account_id}?fields=id,name,business,business_name,amount_spent,balance,currency,default_dsa_beneficiary,default_dsa_payor,timezone_name,instagram_accounts{id,username},spend_cap`;

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error retrieving AdAccount details:', error);
    return { error: 'An error occurred while retrieving AdAccount details.' };
  }
};

/**
 * Tool configuration for retrieving AdAccount details from the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'retrieve_ad_account_details',
      description: 'Retrieve details of an AdAccount from the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The ID of the AdAccount to retrieve details for.'
          },
          base_url: {
            type: 'string',
            description: 'The base URL for the Marketing API.'
          }
        },
        required: ['account_id']
      }
    }
  }
};

export { apiTool };