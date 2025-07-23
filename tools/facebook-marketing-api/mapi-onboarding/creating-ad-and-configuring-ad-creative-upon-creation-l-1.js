/**
 * Function to create an ad and configure ad creative using the Marketing API.
 *
 * @param {Object} args - Arguments for creating the ad.
 * @param {string} args.account_id - The account ID to create the ad under.
 * @param {string} args.adSet_id - The ID of the ad set to which the ad belongs.
 * @param {string} args.page_id - The ID of the Facebook page associated with the ad.
 * @param {string} args.ig_actor_id - The Instagram actor ID for the ad.
 * @param {string} args.image_url - The URL of the image to be used in the ad.
 * @param {string} args.link - The link to which the ad will direct users.
 * @returns {Promise<Object>} - The result of the ad creation.
 */
const executeFunction = async ({ account_id, adSet_id, page_id, ig_actor_id, image_url, link }) => {
  const baseUrl = ''; // will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;

  try {
    const url = `${baseUrl}/act_${account_id}/ads?name=Testing Ad- POSTMAN&status=PAUSED&adset_id=${adSet_id}&creative={"object_story_spec":{"page_id":"${page_id}","instagram_actor_id":"${ig_actor_id}","link_data":{"call_to_action":{"type":"LEARN_MORE"},"message":"my testing Ad","picture":"${image_url}","link":"${link}"}},"degrees_of_freedom_spec":{"creative_features_spec":{"standard_enhancements":{"enroll_status":"OPT_IN"}}}}`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating ad:', error);
    return { error: 'An error occurred while creating the ad.' };
  }
};

/**
 * Tool configuration for creating an ad using the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_ad',
      description: 'Create an ad and configure ad creative using the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The account ID to create the ad under.'
          },
          adSet_id: {
            type: 'string',
            description: 'The ID of the ad set to which the ad belongs.'
          },
          page_id: {
            type: 'string',
            description: 'The ID of the Facebook page associated with the ad.'
          },
          ig_actor_id: {
            type: 'string',
            description: 'The Instagram actor ID for the ad.'
          },
          image_url: {
            type: 'string',
            description: 'The URL of the image to be used in the ad.'
          },
          link: {
            type: 'string',
            description: 'The link to which the ad will direct users.'
          }
        },
        required: ['account_id', 'adSet_id', 'page_id', 'ig_actor_id', 'image_url', 'link']
      }
    }
  }
};

export { apiTool };