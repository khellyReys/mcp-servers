/**
 * Function to update adSet details in the Marketing API.
 *
 * @param {Object} args - Arguments for updating the adSet.
 * @param {string} args.adSet_id - The ID of the adSet to update.
 * @param {string} args.name - The new name for the adSet.
 * @param {Object} args.targeting - The targeting options for the adSet.
 * @param {string} args.end_time - The end time for the adSet.
 * @param {string} args.status - The status of the adSet (e.g., PAUSED).
 * @returns {Promise<Object>} - The result of the adSet update.
 */
const executeFunction = async ({ adSet_id, name, targeting, end_time, status }) => {
  const baseUrl = ''; // will be provided by the user
  const token = process.env.FACEBOOK_MARKETING_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/${adSet_id}`);
    url.searchParams.append('name', name);
    url.searchParams.append('targeting', JSON.stringify(targeting));
    url.searchParams.append('end_time', end_time);
    url.searchParams.append('status', status);

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
    console.error('Error updating adSet details:', error);
    return { error: 'An error occurred while updating adSet details.' };
  }
};

/**
 * Tool configuration for updating adSet details in the Marketing API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_adSet',
      description: 'Update adSet details in the Marketing API.',
      parameters: {
        type: 'object',
        properties: {
          adSet_id: {
            type: 'string',
            description: 'The ID of the adSet to update.'
          },
          name: {
            type: 'string',
            description: 'The new name for the adSet.'
          },
          targeting: {
            type: 'object',
            description: 'The targeting options for the adSet.'
          },
          end_time: {
            type: 'string',
            description: 'The end time for the adSet.'
          },
          status: {
            type: 'string',
            description: 'The status of the adSet (e.g., PAUSED).'
          }
        },
        required: ['adSet_id', 'name', 'targeting', 'end_time', 'status']
      }
    }
  }
};

export { apiTool };