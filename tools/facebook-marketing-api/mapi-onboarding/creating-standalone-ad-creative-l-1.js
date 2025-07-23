/**
 * Function to create a standalone adCreative in the Marketing API.
 *
 * @param {Object} args - Arguments for creating the adCreative.
 * @param {string} args.account_id - The account ID for the adCreative.
 * @param {string} args.ig_actor_id - The Instagram actor ID for the adCreative.
 * @param {string} args.page_id - The page ID associated with the adCreative.
 * @param {string} args.image_hash - The hash of the image to be used in the adCreative.
 * @param {string} args.link - The link associated with the adCreative.
 * @returns {Promise<Object>} - The result of the adCreative creation.
 */
const executeFunction = async ({ account_id, ig_actor_id, page_id, image_hash, link }) => {
  const baseUrl = ''; // Base URL will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;

  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/act_${account_id}/adcreatives`);
    url.searchParams.append('degrees_of_freedom_spec', JSON.stringify({ creative_features_spec: { standard_enhancements: { enroll_status: "OPT_IN" } } }));
    url.searchParams.append('object_story_spec', JSON.stringify({
      instagram_actor_id: ig_actor_id,
      page_id: page_id,
      link_data: {
        call_to_action: { type: "GET_OFFER" },
        image_hash: image_hash,
        link: link,
        message: "This is my ad text"
      }
    }));
    url.searchParams.append('name', 'SingleImage Ad creative');

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
    console.error('Error creating adCreative:', error);
    return { error: 'An error occurred while creating the adCreative.' };
  }
};

/**
 * Tool configuration for creating adCreative in the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_adCreative',
      description: 'Create a standalone adCreative in the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The account ID for the adCreative.'
          },
          ig_actor_id: {
            type: 'string',
            description: 'The Instagram actor ID for the adCreative.'
          },
          page_id: {
            type: 'string',
            description: 'The page ID associated with the adCreative.'
          },
          image_hash: {
            type: 'string',
            description: 'The hash of the image to be used in the adCreative.'
          },
          link: {
            type: 'string',
            description: 'The link associated with the adCreative.'
          }
        },
        required: ['account_id', 'ig_actor_id', 'page_id', 'image_hash', 'link']
      }
    }
  }
};

export { apiTool };