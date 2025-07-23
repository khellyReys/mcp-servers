/**
 * Function to get targeting categories from the Facebook Marketing API.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.account_id - The Ad Account ID to fetch targeting categories for.
 * @param {string} args.base_url - The base URL for the Facebook Marketing API.
 * @returns {Promise<Object>} - The response from the API containing targeting categories.
 */
const executeFunction = async ({ account_id, base_url }) => {
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${base_url}/act_${account_id}/broadtargetingcategories`;

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
    console.error('Error fetching targeting categories:', error);
    return { error: 'An error occurred while fetching targeting categories.' };
  }
};

/**
 * Tool configuration for getting targeting categories from the Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'GetTargetingCategories',
      description: 'Get targeting categories from the Facebook Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The Ad Account ID to fetch targeting categories for.'
          },
          base_url: {
            type: 'string',
            description: 'The base URL for the Facebook Marketing API.'
          }
        },
        required: ['account_id', 'base_url']
      }
    }
  }
};

export { apiTool };