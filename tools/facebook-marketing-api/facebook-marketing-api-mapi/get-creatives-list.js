/**
 * Function to get the list of ad creatives from Facebook Marketing API.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.account_id - The ad account ID to retrieve creatives from.
 * @param {string} args.base_url - The base URL for the Facebook Marketing API.
 * @returns {Promise<Object>} - The list of ad creatives or an error message.
 */
const executeFunction = async ({ account_id, base_url }) => {
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${base_url}/act_${account_id}/adcreatives/`;

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
    console.error('Error retrieving ad creatives:', error);
    return { error: 'An error occurred while retrieving ad creatives.' };
  }
};

/**
 * Tool configuration for getting the list of ad creatives from Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'GetCreativesList',
      description: 'Get the list of ad creatives from Facebook Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The ad account ID to retrieve creatives from.'
          },
          base_url: {
            type: 'string',
            description: 'The base URL for the Facebook Marketing API.'
          }
        },
        required: ['account_id', 'base_url']
      }
    }
  }
};

export { apiTool };