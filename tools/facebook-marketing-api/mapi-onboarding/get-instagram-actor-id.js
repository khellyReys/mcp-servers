/**
 * Function to get the Instagram actor ID for a given account.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.account_id - The account ID for which to retrieve the Instagram actor ID.
 * @returns {Promise<Object>} - The response containing the Instagram actor ID.
 */
const executeFunction = async ({ account_id }) => {
  const baseUrl = ''; // will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${baseUrl}/act_${account_id}/instagram_accounts`;

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
    console.error('Error getting Instagram actor ID:', error);
    return { error: 'An error occurred while retrieving the Instagram actor ID.' };
  }
};

/**
 * Tool configuration for getting the Instagram actor ID.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_instagram_actor_id',
      description: 'Get the Instagram actor ID for a given account.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The account ID for which to retrieve the Instagram actor ID.'
          }
        },
        required: ['account_id']
      }
    }
  }
};

export { apiTool };