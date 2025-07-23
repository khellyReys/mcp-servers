/**
 * Function to update ad details in the Marketing API.
 *
 * @param {Object} args - Arguments for updating ad details.
 * @param {string} args.ad_id - The ID of the ad to be updated.
 * @param {string} args.page_id - The ID of the Facebook page associated with the ad.
 * @param {string} args.ig_actor_id - The Instagram actor ID for the ad.
 * @param {string} args.image_hash2 - The hash of the image to be used in the ad.
 * @param {string} args.link - The link associated with the ad.
 * @returns {Promise<Object>} - The result of the ad update operation.
 */
const executeFunction = async ({ ad_id, page_id, ig_actor_id, image_hash2, link }) => {
  const baseUrl = ''; // will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL for the ad update
    const url = new URL(`${baseUrl}/${ad_id}`);
    url.searchParams.append('name', 'My Ad [Updated]');
    url.searchParams.append('status', 'PAUSED');
    url.searchParams.append('creative', JSON.stringify({
      object_story_spec: {
        page_id: page_id,
        instagram_actor_id: ig_actor_id,
        link_data: {
          call_to_action: { type: 'LEARN_MORE' },
          image_hash: image_hash2,
          link: link
        }
      },
      degrees_of_freedom_spec: {
        creative_features_spec: {
          standard_enhancements: { enroll_status: 'OPT_IN' }
        }
      }
    }));

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
    console.error('Error updating ad details:', error);
    return { error: 'An error occurred while updating ad details.' };
  }
};

/**
 * Tool configuration for updating ad details in the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_ad_details',
      description: 'Update details of an ad in the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          ad_id: {
            type: 'string',
            description: 'The ID of the ad to be updated.'
          },
          page_id: {
            type: 'string',
            description: 'The ID of the Facebook page associated with the ad.'
          },
          ig_actor_id: {
            type: 'string',
            description: 'The Instagram actor ID for the ad.'
          },
          image_hash2: {
            type: 'string',
            description: 'The hash of the image to be used in the ad.'
          },
          link: {
            type: 'string',
            description: 'The link associated with the ad.'
          }
        },
        required: ['ad_id', 'page_id', 'ig_actor_id', 'image_hash2', 'link']
      }
    }
  }
};

export { apiTool };