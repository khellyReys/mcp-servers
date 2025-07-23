/**
 * Function to create an ad creative using existing creative on Facebook Marketing API.
 *
 * @param {Object} args - Arguments for creating the ad creative.
 * @param {string} args.account_id - The ad account ID.
 * @param {string} args.object_story_id - The object story ID for the ad creative.
 * @param {string} args.page_id - The page ID associated with the ad creative.
 * @returns {Promise<Object>} - The result of the ad creative creation.
 */
const executeFunction = async ({ account_id, object_story_id, page_id }) => {
  const baseUrl = ''; // will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = new URL(`${baseUrl}/act_${account_id}/adcreatives`);
    url.searchParams.append('name', 'postmanCreative');
    url.searchParams.append('object_story_id', object_story_id);
    url.searchParams.append('page_id', page_id);

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'POST',
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
    console.error('Error creating ad creative:', error);
    return { error: 'An error occurred while creating the ad creative.' };
  }
};

/**
 * Tool configuration for creating an ad creative on Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'CreateUsingExistingCreative',
      description: 'Create an ad creative using existing creative on Facebook Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The ad account ID.'
          },
          object_story_id: {
            type: 'string',
            description: 'The object story ID for the ad creative.'
          },
          page_id: {
            type: 'string',
            description: 'The page ID associated with the ad creative.'
          }
        },
        required: ['account_id', 'object_story_id', 'page_id']
      }
    }
  }
};

export { apiTool };