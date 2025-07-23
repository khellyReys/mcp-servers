/**
 * Function to get ad set fields from the Facebook Marketing API.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.adset_id - The ID of the ad set to retrieve.
 * @param {string} args.base_url - The base URL for the Facebook Marketing API.
 * @param {string} args.token - The access token for authentication.
 * @returns {Promise<Object>} - The response data from the API.
 */
const executeFunction = async ({ adset_id, base_url }) => {
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${base_url}/${adset_id}?fields=account_id,campaign_id,created_time,effective_status,id,name,recommendations,status`;

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
    console.error('Error fetching ad set fields:', error);
    return { error: 'An error occurred while fetching ad set fields.' };
  }
};

/**
 * Tool configuration for getting ad set fields from the Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'GetAdsetFields',
      description: 'Retrieve fields for a specific ad set from the Facebook Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          adset_id: {
            type: 'string',
            description: 'The ID of the ad set to retrieve.'
          },
          base_url: {
            type: 'string',
            description: 'The base URL for the Facebook Marketing API.'
          }
        },
        required: ['adset_id', 'base_url']
      }
    }
  }
};

export { apiTool };