/**
 * Function to get the Facebook page ID associated with a specific account.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.account_id - The account ID for which to retrieve the page ID.
 * @param {string} [args.base_url='https://graph.facebook.com/v12.0'] - The base URL for the Facebook Graph API.
 * @returns {Promise<Object>} - The response containing the page ID or an error message.
 */
const executeFunction = async ({ account_id, base_url = 'https://graph.facebook.com/v12.0' }) => {
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${base_url}/act_${account_id}?fields=promote_pages`;

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
    console.error('Error retrieving Facebook page ID:', error);
    return { error: 'An error occurred while retrieving the Facebook page ID.' };
  }
};

/**
 * Tool configuration for getting the Facebook page ID.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_fb_page_id',
      description: 'Retrieve the Facebook page ID associated with a specific account.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The account ID for which to retrieve the page ID.'
          },
          base_url: {
            type: 'string',
            description: 'The base URL for the Facebook Graph API.'
          }
        },
        required: ['account_id']
      }
    }
  }
};

export { apiTool };