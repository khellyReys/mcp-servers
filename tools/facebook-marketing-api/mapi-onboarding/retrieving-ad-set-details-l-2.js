/**
 * Function to retrieve adSet details from the Marketing API.
 *
 * @param {Object} args - Arguments for the adSet retrieval.
 * @param {string} args.adSet_id - The ID of the adSet to retrieve.
 * @param {string} args.base_url - The base URL for the Marketing API.
 * @returns {Promise<Object>} - The details of the adSet.
 */
const executeFunction = async ({ adSet_id, base_url }) => {
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${base_url}/${adSet_id}?fields=name,campaign_id,optimization_goal,start_time,end_time,bid_strategy,destination_type`;

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
    console.error('Error retrieving adSet details:', error);
    return { error: 'An error occurred while retrieving adSet details.' };
  }
};

/**
 * Tool configuration for retrieving adSet details from the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'retrieve_adSet_details',
      description: 'Retrieve details of a specific adSet from the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          adSet_id: {
            type: 'string',
            description: 'The ID of the adSet to retrieve.'
          },
          base_url: {
            type: 'string',
            description: 'The base URL for the Marketing API.'
          }
        },
        required: ['adSet_id', 'base_url']
      }
    }
  }
};

export { apiTool };