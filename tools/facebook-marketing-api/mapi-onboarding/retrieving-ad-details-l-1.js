/**
 * Function to retrieve ad details from the Marketing API.
 *
 * @param {Object} args - Arguments for retrieving ad details.
 * @param {string} args.ad_id - The ID of the ad to retrieve details for.
 * @param {string} args.base_url - The base URL for the Marketing API.
 * @param {string} [args.token=''] - The bearer token for authentication.
 * @returns {Promise<Object>} - The details of the ad.
 */
const executeFunction = async ({ ad_id, base_url, token = '' }) => {
  const url = `${base_url}/${ad_id}?fields=name,campaign{id,name,objective},adset{id,name,optimization_goal},adcreatives{id,image_hash,image_url,effective_object_story_id,effective_instagram_media_id,call_to_action_type},status,created_time,ad_schedule_end_time`;

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
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
    console.error('Error retrieving ad details:', error);
    return { error: 'An error occurred while retrieving ad details.' };
  }
};

/**
 * Tool configuration for retrieving ad details from the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'retrieve_ad_details',
      description: 'Retrieve details of a specific ad from the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          ad_id: {
            type: 'string',
            description: 'The ID of the ad to retrieve details for.'
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
        required: ['ad_id', 'base_url']
      }
    }
  }
};

export { apiTool };