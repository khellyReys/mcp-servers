/**
 * Function to copy an ad in the Facebook Marketing API.
 *
 * @param {Object} args - Arguments for the ad copy.
 * @param {string} args.ad_id_awareness - The ID of the ad to be copied.
 * @param {string} [args.status_option="PAUSED"] - The status option for the copied ad.
 * @param {Object} [args.rename_options={}] - Options for renaming the copied ad.
 * @returns {Promise<Object>} - The result of the ad copy operation.
 */
const executeFunction = async ({ ad_id_awareness, status_option = 'PAUSED', rename_options = { rename_strategy: "ONLY_TOP_LEVEL_RENAME" } }) => {
  const baseUrl = ''; // will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/${ad_id_awareness}/copies`);
    url.searchParams.append('status_option', status_option);
    url.searchParams.append('rename_options', JSON.stringify(rename_options));

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
    console.error('Error copying ad:', error);
    return { error: 'An error occurred while copying the ad.' };
  }
};

/**
 * Tool configuration for copying an ad in the Facebook Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'CopiesAd',
      description: 'Copy an ad in the Facebook Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          ad_id_awareness: {
            type: 'string',
            description: 'The ID of the ad to be copied.'
          },
          status_option: {
            type: 'string',
            description: 'The status option for the copied ad.'
          },
          rename_options: {
            type: 'object',
            description: 'Options for renaming the copied ad.'
          }
        },
        required: ['ad_id_awareness']
      }
    }
  }
};

export { apiTool };