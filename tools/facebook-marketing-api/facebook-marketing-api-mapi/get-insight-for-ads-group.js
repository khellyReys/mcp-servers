/**
 * Function to get insights for an ads group from the Facebook Marketing API.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.ad_id - The ID of the ad to retrieve insights for.
 * @param {string} [args.date_preset="maximum"] - The date preset for the insights.
 * @param {number} [args.limit=100] - The number of insights to return.
 * @param {string} [args.action_breakdowns="action_type"] - The breakdown of actions to return.
 * @param {string} [args.fields] - The fields to include in the response.
 * @param {string} [args.time_increment="all_days"] - The time increment for the insights.
 * @returns {Promise<Object>} - The insights data for the specified ad.
 */
const executeFunction = async ({ ad_id, date_preset = 'maximum', limit = 100, action_breakdowns = 'action_type', fields, time_increment = 'all_days' }) => {
  const baseUrl = ''; // will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/insights`);
    url.searchParams.append('date_preset', date_preset);
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('action_breakdowns', action_breakdowns);
    url.searchParams.append('ids', ad_id);
    url.searchParams.append('fields', fields);
    url.searchParams.append('time_increment', time_increment);

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    // Perform the fetch request
    const response = await fetch(url.toString(), {
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
    console.error('Error getting insights for ads group:', error);
    return { error: 'An error occurred while getting insights for the ads group.' };
  }
};

/**
 * Tool configuration for getting insights for an ads group from the Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'GetInsightForAdsGroup',
      description: 'Get insights for a specific ads group from the Facebook Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          ad_id: {
            type: 'string',
            description: 'The ID of the ad to retrieve insights for.'
          },
          date_preset: {
            type: 'string',
            description: 'The date preset for the insights.'
          },
          limit: {
            type: 'integer',
            description: 'The number of insights to return.'
          },
          action_breakdowns: {
            type: 'string',
            description: 'The breakdown of actions to return.'
          },
          fields: {
            type: 'string',
            description: 'The fields to include in the response.'
          },
          time_increment: {
            type: 'string',
            description: 'The time increment for the insights.'
          }
        },
        required: ['ad_id']
      }
    }
  }
};

export { apiTool };