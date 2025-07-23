/**
 * Function to get the Ad Account details from the Facebook Marketing API.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.account_id - The Ad Account ID to retrieve details for.
 * @returns {Promise<Object>} - The details of the Ad Account.
 */
const executeFunction = async ({ account_id }) => {
  const baseUrl = 'https://graph.facebook.com/v12.0'; // Adjust version as needed
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${baseUrl}/act_${account_id}`;

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
    console.error('Error getting Ad Account details:', error);
    return { error: 'An error occurred while retrieving Ad Account details.' };
  }
};

/**
 * Tool configuration for getting Ad Account details from the Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'GetAdAccount',
      description: 'Retrieve details for a specific Ad Account from the Facebook Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The Ad Account ID to retrieve details for.'
          }
        },
        required: ['account_id']
      }
    }
  }
};

export { apiTool };