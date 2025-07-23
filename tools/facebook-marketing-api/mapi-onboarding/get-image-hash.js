/**
 * Function to get image hashes from the Marketing API.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.account_id - The account ID for the Marketing API.
 * @param {string} args.base_url - The base URL for the Marketing API.
 * @returns {Promise<Object>} - The result of the image hash retrieval.
 */
const executeFunction = async ({ account_id, base_url }) => {
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${base_url}/act_${account_id}/adimages`;

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
    console.error('Error retrieving image hashes:', error);
    return { error: 'An error occurred while retrieving image hashes.' };
  }
};

/**
 * Tool configuration for getting image hashes from the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_image_hash',
      description: 'Get image hashes from the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The account ID for the Marketing API.'
          },
          base_url: {
            type: 'string',
            description: 'The base URL for the Marketing API.'
          }
        },
        required: ['account_id', 'base_url']
      }
    }
  }
};

export { apiTool };