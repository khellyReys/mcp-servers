/**
 * Function to get report for insight attribution from Facebook Marketing API.
 *
 * @param {Object} args - Arguments for the report request.
 * @param {string} args.amazon_report_attribution_id2 - The ID for the report attribution.
 * @returns {Promise<Object>} - The result of the report request.
 */
const executeFunction = async ({ amazon_report_attribution_id2 }) => {
  const baseUrl = ''; // will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${baseUrl}/${amazon_report_attribution_id2}/insights`;

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
    console.error('Error getting report for insight attribution:', error);
    return { error: 'An error occurred while getting the report.' };
  }
};

/**
 * Tool configuration for getting report for insight attribution from Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'GetReportForInsightAttribution',
      description: 'Get report for insight attribution from Facebook Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          amazon_report_attribution_id2: {
            type: 'string',
            description: 'The ID for the report attribution.'
          }
        },
        required: ['amazon_report_attribution_id2']
      }
    }
  }
};

export { apiTool };