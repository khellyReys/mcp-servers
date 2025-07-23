/**
 * Function to create an ad based on adCreative ID in the Marketing API.
 *
 * @param {Object} args - Arguments for creating an ad.
 * @param {string} args.account_id - The account ID for the ad.
 * @param {string} args.adSet_id - The ad set ID where the ad will be created.
 * @param {string} args.creative_id - The creative ID to be used for the ad.
 * @param {string} [args.name="Testing Ad- singleImage-POSTMAN"] - The name of the ad.
 * @param {string} [args.status="PAUSED"] - The status of the ad.
 * @returns {Promise<Object>} - The result of the ad creation.
 */
const executeFunction = async ({ account_id, adSet_id, creative_id, name = "Testing Ad- singleImage-POSTMAN", status = "PAUSED" }) => {
  const baseUrl = ''; // will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/act_${account_id}/ads`);
    url.searchParams.append('name', name);
    url.searchParams.append('status', status);
    url.searchParams.append('adset_id', adSet_id);
    url.searchParams.append('creative', JSON.stringify({ creative_id }));

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
    console.error('Error creating ad:', error);
    return { error: 'An error occurred while creating the ad.' };
  }
};

/**
 * Tool configuration for creating an ad in the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_ad',
      description: 'Create an ad based on adCreative ID in the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          account_id: {
            type: 'string',
            description: 'The account ID for the ad.'
          },
          adSet_id: {
            type: 'string',
            description: 'The ad set ID where the ad will be created.'
          },
          creative_id: {
            type: 'string',
            description: 'The creative ID to be used for the ad.'
          },
          name: {
            type: 'string',
            description: 'The name of the ad.'
          },
          status: {
            type: 'string',
            description: 'The status of the ad.'
          }
        },
        required: ['account_id', 'adSet_id', 'creative_id']
      }
    }
  }
};

export { apiTool };