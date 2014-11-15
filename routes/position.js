/**
 * API Specification Author: aandre@mit.edu
 */

/**
 * Position Object Specification
 *
 * Position: {
 *   _id: PositionID,
 *   name: String
 * }
 */

/**
 * GET /positions/
 *
 * Description: Retrieves all positions.
 *
 * Permissions: All users can retrieve positions.
 *
 * Response: {
 *   positions: Position[]
 * }
 *
 */

 /**
 * POST /positions/
 *
 * Description: Create a new position.
 *
 * Permissions: Employers only.
 *
 * Request: {
 *   position: Position
 * }
 *
 * Response: {
 *   position: Position
 * }
 *
 */

 /**
 * GET /positions/:id
 *
 * Description: Retrieve the specific position.
 *
 * Permissions: All users can retrieve positions.
 *
 * Path Params:
 *   id - Availibility identifier
 *
 * Response: {
 *   position: Position
 * }
 *
 */

 /**
 * PUT /positions/:id
 *
 * Description: Modify the specified position.
 *
 * Permissions: Employers only.
 *
 * Path Params:
 *   id - Availibility identifier
 *
 * Request: {
 *   position: Position
 * }
 *
 * Response: {
 *   position: Position
 * }
 *
 */

 /**
 * DELETE /positions/:id
 *
 * Description: Delete specified position and associated shifts.
 *
 * Permissions: Employers only.
 *
 * Path Params:
 *   id - Availibility identifier
 *
 * Response: {
 *   PositionId: PositionID
 * }
 *
 */