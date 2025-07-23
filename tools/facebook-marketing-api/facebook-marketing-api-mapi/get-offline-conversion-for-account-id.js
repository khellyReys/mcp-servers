/**
 * Function to get offline conversion data sets for a specific ad account in the Facebook Marketing API.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.account_id - The ID of the ad account to retrieve offline conversion data sets for.
 * @param {string} [args.base_url='https://graph.facebook.com/v12.0'] - The base URL for the Facebook Graph API.
 * @returns {Promise<Object>} - The result of the offline conversion data set request.
 */
const executeFunction = async ({ account_id, base_url = 'https://graph.facebook.com/v12.0' }) => {
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${base_url}/act_${account_id}/offline_conversion_data_sets?fields=name,id,description,valid_entries,matched_entries,event_time_min,event_time_max,event_stats,business,is_assigned_to_ad_accounts_in_business,enable_auto_assign_to_accounts,auto_track_for_ads`;

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
    console.error('Error fetching offline conversion data sets:', error);
    return { error: 'An error occurred while fetching offline conversion data sets.' };
  }
};

/**
 * Tool configuration for getting offline conversion data sets from the Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'GetOfflineConversionForAccountId',
      description: 'Get offline conversion data sets for a specific ad account.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The ID of the ad account to retrieve offline conversion data sets for.'
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