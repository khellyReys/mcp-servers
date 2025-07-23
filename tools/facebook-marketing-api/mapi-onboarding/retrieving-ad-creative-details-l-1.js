/**
 * Function to retrieve adCreative details from the Marketing API.
 *
 * @param {Object} args - Arguments for retrieving adCreative details.
 * @param {string} args.creative_id - The ID of the creative to retrieve details for.
 * @param {string} args.base_url - The base URL for the Marketing API.
 * @returns {Promise<Object>} - The details of the adCreative.
 */
const executeFunction = async ({ creative_id, base_url }) => {
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${base_url}/${creative_id}?fields=asset_feed_spec,body,call_to_action_type,degrees_of_freedom_spec,effective_instagram_media_id,effective_object_story_id,image_hash,image_url,instagram_actor_id,name,account_id,status,title`;

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
    console.error('Error retrieving adCreative details:', error);
    return { error: 'An error occurred while retrieving adCreative details.' };
  }
};

/**
 * Tool configuration for retrieving adCreative details from the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'retrieve_adCreative_details',
      description: 'Retrieve details of an adCreative from the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          creative_id: {
            type: 'string',
            description: 'The ID of the creative to retrieve details for.'
          },
          base_url: {
            type: 'string',
            description: 'The base URL for the Marketing API.'
          }
        },
        required: ['creative_id', 'base_url']
      }
    }
  }
};

export { apiTool };