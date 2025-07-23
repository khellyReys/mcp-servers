/**
 * Function to get ad insights from the Marketing API.
 *
 * @param {Object} args - Arguments for the ad insights request.
 * @param {string} args.ad_id - The ID of the ad for which insights are to be retrieved.
 * @param {string} [args.base_url] - The base URL for the Marketing API.
 * @returns {Promise<Object>} - The insights data for the specified ad.
 */
const executeFunction = async ({ ad_id, base_url }) => {
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${base_url}/${ad_id}/insights?fields=ad_id,clicks,impressions,spend,outbound_clicks,actions,action_values,cost_per_unique_action_type,reach&action_report_time=conversion&date_preset=this_year`;

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
    console.error('Error fetching ad insights:', error);
    return { error: 'An error occurred while fetching ad insights.' };
  }
};

/**
 * Tool configuration for getting ad insights from the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_ad_insights',
      description: 'Get insights for a specific ad from the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          ad_id: {
            type: 'string',
            description: 'The ID of the ad for which insights are to be retrieved.'
          },
          base_url: {
            type: 'string',
            description: 'The base URL for the Marketing API.'
          }
        },
        required: ['ad_id', 'base_url']
      }
    }
  }
};

export { apiTool };