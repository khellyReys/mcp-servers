/**
 * Function to get agencies associated with a Facebook Ad Account.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.account_id - The ID of the Facebook Ad Account.
 * @param {string} args.base_url - The base URL for the Facebook API.
 * @returns {Promise<Object>} - The response containing the agencies or an error message.
 */
const executeFunction = async ({ account_id, base_url }) => {
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${base_url}/act_${account_id}/agencies?fields=permitted_tasks`;

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
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
    console.error('Error getting agencies:', error);
    return { error: 'An error occurred while retrieving agencies.' };
  }
};

/**
 * Tool configuration for getting agencies from Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'GetAgencies',
      description: 'Retrieve agencies associated with a Facebook Ad Account.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The ID of the Facebook Ad Account.'
          },
          base_url: {
            type: 'string',
            description: 'The base URL for the Facebook API.'
          }
        },
        required: ['account_id', 'base_url']
      }
    }
  }
};

export { apiTool };