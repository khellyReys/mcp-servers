/**
 * Function to get custom conversions for a specified Facebook Ad Account ID.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.account_id - The ID of the Facebook Ad Account.
 * @param {string} args.token - The access token for authentication.
 * @returns {Promise<Object>} - The result of the custom conversions request.
 */
const executeFunction = async ({ account_id }) => {
  const baseUrl = ''; // will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${baseUrl}/act_${account_id}/customconversions?fields=account_id,creation_time,custom_event_type,default_conversion_value,description,data_sources,first_fired_time,is_archived,last_fired_time,name,pixel,rule,id`;

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
    console.error('Error getting custom conversions:', error);
    return { error: 'An error occurred while getting custom conversions.' };
  }
};

/**
 * Tool configuration for getting custom conversions for a Facebook Ad Account.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'GetCustomConversionforAccountId',
      description: 'Get custom conversions for a specified Facebook Ad Account ID.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The ID of the Facebook Ad Account.'
          }
        },
        required: ['account_id']
      }
    }
  }
};

export { apiTool };