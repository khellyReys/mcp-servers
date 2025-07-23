/**
 * Function to get insights for a specific AdSet in the Marketing API.
 *
 * @param {Object} args - Arguments for the insights request.
 * @param {string} args.adSet_id - The ID of the AdSet for which to retrieve insights.
 * @param {string} [args.date_preset='last_quarter'] - The date preset for the insights.
 * @returns {Promise<Object>} - The insights data for the specified AdSet.
 */
const executeFunction = async ({ adSet_id, date_preset = 'last_quarter' }) => {
  const baseUrl = ''; // will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the insights request
    const url = new URL(`${baseUrl}/${adSet_id}/insights`);
    url.searchParams.append('date_preset', date_preset);

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
    console.error('Error retrieving AdSet insights:', error);
    return { error: 'An error occurred while retrieving AdSet insights.' };
  }
};

/**
 * Tool configuration for retrieving AdSet insights in the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_adset_insights',
      description: 'Get insights for a specific AdSet in the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          adSet_id: {
            type: 'string',
            description: 'The ID of the AdSet for which to retrieve insights.'
          },
          date_preset: {
            type: 'string',
            description: 'The date preset for the insights.'
          }
        },
        required: ['adSet_id']
      }
    }
  }
};

export { apiTool };