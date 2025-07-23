/**
 * Function to get insight details from an ad account using the Marketing API.
 *
 * @param {Object} args - Arguments for the insight retrieval.
 * @param {string} args.account_id - The ID of the ad account to retrieve insights for.
 * @param {string} args.token - The bearer token for authentication.
 * @param {string} [args.base_url='https://graph.facebook.com/v12.0'] - The base URL for the Marketing API.
 * @returns {Promise<Object>} - The result of the insight retrieval.
 */
const executeFunction = async ({ account_id, token, base_url = 'https://graph.facebook.com/v12.0' }) => {
  const url = `${base_url}/act_${account_id}/insights?fields=impressions,clicks,conversions,cpc,cpm,cpp,ctr,frequency,reach,social_spend,video_play_actions,spend,account_currency&time_range={"since":"2024-06-01","until":"2024-12-15"}&breakdowns=age,gender`;
  
  try {
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
    console.error('Error retrieving insight details:', error);
    return { error: 'An error occurred while retrieving insight details.' };
  }
};

/**
 * Tool configuration for getting insight details from an ad account.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_insight_details',
      description: 'Get insight details from an ad account.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The ID of the ad account to retrieve insights for.'
          },
          token: {
            type: 'string',
            description: 'The bearer token for authentication.'
          },
          base_url: {
            type: 'string',
            description: 'The base URL for the Marketing API.'
          }
        },
        required: ['account_id', 'token']
      }
    }
  }
};

export { apiTool };