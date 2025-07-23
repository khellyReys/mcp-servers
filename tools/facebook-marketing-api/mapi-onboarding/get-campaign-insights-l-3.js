/**
 * Function to get campaign insights from the Marketing API.
 *
 * @param {Object} args - Arguments for the insights request.
 * @param {string} args.campaign_id - The ID of the campaign to retrieve insights for.
 * @param {string} [args.base_url] - The base URL for the Marketing API.
 * @param {string} [args.token] - The bearer token for authentication.
 * @returns {Promise<Object>} - The insights data for the specified campaign.
 */
const executeFunction = async ({ campaign_id, base_url, token }) => {
  const url = `${base_url}/${campaign_id}/insights?fields=impressions,clicks,conversions,cpc,cpm,cpp,ctr,frequency,reach,social_spend,video_play_actions,spend,account_currency&breakdowns=age,gender`;
  
  // Bearer token for authorization
  const bearerToken = token || ''; // will be provided by the user

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${bearerToken}`,
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
    console.error('Error fetching campaign insights:', error);
    return { error: 'An error occurred while fetching campaign insights.' };
  }
};

/**
 * Tool configuration for getting campaign insights from the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_campaign_insights',
      description: 'Get insights for a specific campaign from the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          campaign_id: {
            type: 'string',
            description: 'The ID of the campaign to retrieve insights for.'
          },
          base_url: {
            type: 'string',
            description: 'The base URL for the Marketing API.'
          },
          token: {
            type: 'string',
            description: 'The bearer token for authentication.'
          }
        },
        required: ['campaign_id', 'base_url']
      }
    }
  }
};

export { apiTool };