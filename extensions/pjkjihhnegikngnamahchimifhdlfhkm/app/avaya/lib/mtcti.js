/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
(function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.SubscribeCallLog = (function() {
    
        /**
         * Properties of a SubscribeCallLog.
         * @exports ISubscribeCallLog
         * @interface ISubscribeCallLog
         * @property {boolean|null} [missed] SubscribeCallLog missed
         * @property {boolean|null} [answered] SubscribeCallLog answered
         * @property {boolean|null} [outbound] SubscribeCallLog outbound
         * @property {boolean|null} [fullonly] SubscribeCallLog fullonly
         */
    
        /**
         * Constructs a new SubscribeCallLog.
         * @exports SubscribeCallLog
         * @classdesc Represents a SubscribeCallLog.
         * @implements ISubscribeCallLog
         * @constructor
         * @param {ISubscribeCallLog=} [properties] Properties to set
         */
        function SubscribeCallLog(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * SubscribeCallLog missed.
         * @member {boolean} missed
         * @memberof SubscribeCallLog
         * @instance
         */
        SubscribeCallLog.prototype.missed = false;
    
        /**
         * SubscribeCallLog answered.
         * @member {boolean} answered
         * @memberof SubscribeCallLog
         * @instance
         */
        SubscribeCallLog.prototype.answered = false;
    
        /**
         * SubscribeCallLog outbound.
         * @member {boolean} outbound
         * @memberof SubscribeCallLog
         * @instance
         */
        SubscribeCallLog.prototype.outbound = false;
    
        /**
         * SubscribeCallLog fullonly.
         * @member {boolean} fullonly
         * @memberof SubscribeCallLog
         * @instance
         */
        SubscribeCallLog.prototype.fullonly = false;
    
        /**
         * Creates a new SubscribeCallLog instance using the specified properties.
         * @function create
         * @memberof SubscribeCallLog
         * @static
         * @param {ISubscribeCallLog=} [properties] Properties to set
         * @returns {SubscribeCallLog} SubscribeCallLog instance
         */
        SubscribeCallLog.create = function create(properties) {
            return new SubscribeCallLog(properties);
        };
    
        /**
         * Encodes the specified SubscribeCallLog message. Does not implicitly {@link SubscribeCallLog.verify|verify} messages.
         * @function encode
         * @memberof SubscribeCallLog
         * @static
         * @param {ISubscribeCallLog} message SubscribeCallLog message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubscribeCallLog.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.missed != null && message.hasOwnProperty("missed"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.missed);
            if (message.answered != null && message.hasOwnProperty("answered"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.answered);
            if (message.outbound != null && message.hasOwnProperty("outbound"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.outbound);
            if (message.fullonly != null && message.hasOwnProperty("fullonly"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.fullonly);
            return writer;
        };
    
        /**
         * Encodes the specified SubscribeCallLog message, length delimited. Does not implicitly {@link SubscribeCallLog.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SubscribeCallLog
         * @static
         * @param {ISubscribeCallLog} message SubscribeCallLog message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubscribeCallLog.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a SubscribeCallLog message from the specified reader or buffer.
         * @function decode
         * @memberof SubscribeCallLog
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SubscribeCallLog} SubscribeCallLog
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubscribeCallLog.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SubscribeCallLog();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.missed = reader.bool();
                    break;
                case 2:
                    message.answered = reader.bool();
                    break;
                case 3:
                    message.outbound = reader.bool();
                    break;
                case 4:
                    message.fullonly = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a SubscribeCallLog message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SubscribeCallLog
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SubscribeCallLog} SubscribeCallLog
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubscribeCallLog.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a SubscribeCallLog message.
         * @function verify
         * @memberof SubscribeCallLog
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SubscribeCallLog.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.missed != null && message.hasOwnProperty("missed"))
                if (typeof message.missed !== "boolean")
                    return "missed: boolean expected";
            if (message.answered != null && message.hasOwnProperty("answered"))
                if (typeof message.answered !== "boolean")
                    return "answered: boolean expected";
            if (message.outbound != null && message.hasOwnProperty("outbound"))
                if (typeof message.outbound !== "boolean")
                    return "outbound: boolean expected";
            if (message.fullonly != null && message.hasOwnProperty("fullonly"))
                if (typeof message.fullonly !== "boolean")
                    return "fullonly: boolean expected";
            return null;
        };
    
        /**
         * Creates a SubscribeCallLog message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SubscribeCallLog
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SubscribeCallLog} SubscribeCallLog
         */
        SubscribeCallLog.fromObject = function fromObject(object) {
            if (object instanceof $root.SubscribeCallLog)
                return object;
            var message = new $root.SubscribeCallLog();
            if (object.missed != null)
                message.missed = Boolean(object.missed);
            if (object.answered != null)
                message.answered = Boolean(object.answered);
            if (object.outbound != null)
                message.outbound = Boolean(object.outbound);
            if (object.fullonly != null)
                message.fullonly = Boolean(object.fullonly);
            return message;
        };
    
        /**
         * Creates a plain object from a SubscribeCallLog message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SubscribeCallLog
         * @static
         * @param {SubscribeCallLog} message SubscribeCallLog
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SubscribeCallLog.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.missed = false;
                object.answered = false;
                object.outbound = false;
                object.fullonly = false;
            }
            if (message.missed != null && message.hasOwnProperty("missed"))
                object.missed = message.missed;
            if (message.answered != null && message.hasOwnProperty("answered"))
                object.answered = message.answered;
            if (message.outbound != null && message.hasOwnProperty("outbound"))
                object.outbound = message.outbound;
            if (message.fullonly != null && message.hasOwnProperty("fullonly"))
                object.fullonly = message.fullonly;
            return object;
        };
    
        /**
         * Converts this SubscribeCallLog to JSON.
         * @function toJSON
         * @memberof SubscribeCallLog
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SubscribeCallLog.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return SubscribeCallLog;
    })();
    
    $root.NotifyCallEntry = (function() {
    
        /**
         * Properties of a NotifyCallEntry.
         * @exports INotifyCallEntry
         * @interface INotifyCallEntry
         * @property {number|null} [instance] NotifyCallEntry instance
         * @property {number|null} [utc] NotifyCallEntry utc
         * @property {number|null} [localoffsetadd] NotifyCallEntry localoffsetadd
         * @property {number|null} [localoffsetsubtract] NotifyCallEntry localoffsetsubtract
         * @property {string|null} [datetime] NotifyCallEntry datetime
         * @property {number|null} [count] NotifyCallEntry count
         * @property {NotifyCallEntry.Type|null} [type] NotifyCallEntry type
         * @property {NotifyCallEntry.State|null} [state] NotifyCallEntry state
         * @property {number|null} [duration] NotifyCallEntry duration
         * @property {string|null} [number] NotifyCallEntry number
         * @property {number|null} [numbertype] NotifyCallEntry numbertype
         * @property {string|null} [name] NotifyCallEntry name
         * @property {string|null} [tag] NotifyCallEntry tag
         */
    
        /**
         * Constructs a new NotifyCallEntry.
         * @exports NotifyCallEntry
         * @classdesc Represents a NotifyCallEntry.
         * @implements INotifyCallEntry
         * @constructor
         * @param {INotifyCallEntry=} [properties] Properties to set
         */
        function NotifyCallEntry(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * NotifyCallEntry instance.
         * @member {number} instance
         * @memberof NotifyCallEntry
         * @instance
         */
        NotifyCallEntry.prototype.instance = 0;
    
        /**
         * NotifyCallEntry utc.
         * @member {number} utc
         * @memberof NotifyCallEntry
         * @instance
         */
        NotifyCallEntry.prototype.utc = 0;
    
        /**
         * NotifyCallEntry localoffsetadd.
         * @member {number} localoffsetadd
         * @memberof NotifyCallEntry
         * @instance
         */
        NotifyCallEntry.prototype.localoffsetadd = 0;
    
        /**
         * NotifyCallEntry localoffsetsubtract.
         * @member {number} localoffsetsubtract
         * @memberof NotifyCallEntry
         * @instance
         */
        NotifyCallEntry.prototype.localoffsetsubtract = 0;
    
        /**
         * NotifyCallEntry datetime.
         * @member {string} datetime
         * @memberof NotifyCallEntry
         * @instance
         */
        NotifyCallEntry.prototype.datetime = "";
    
        /**
         * NotifyCallEntry count.
         * @member {number} count
         * @memberof NotifyCallEntry
         * @instance
         */
        NotifyCallEntry.prototype.count = 0;
    
        /**
         * NotifyCallEntry type.
         * @member {NotifyCallEntry.Type} type
         * @memberof NotifyCallEntry
         * @instance
         */
        NotifyCallEntry.prototype.type = 0;
    
        /**
         * NotifyCallEntry state.
         * @member {NotifyCallEntry.State} state
         * @memberof NotifyCallEntry
         * @instance
         */
        NotifyCallEntry.prototype.state = 0;
    
        /**
         * NotifyCallEntry duration.
         * @member {number} duration
         * @memberof NotifyCallEntry
         * @instance
         */
        NotifyCallEntry.prototype.duration = 0;
    
        /**
         * NotifyCallEntry number.
         * @member {string} number
         * @memberof NotifyCallEntry
         * @instance
         */
        NotifyCallEntry.prototype.number = "";
    
        /**
         * NotifyCallEntry numbertype.
         * @member {number} numbertype
         * @memberof NotifyCallEntry
         * @instance
         */
        NotifyCallEntry.prototype.numbertype = 0;
    
        /**
         * NotifyCallEntry name.
         * @member {string} name
         * @memberof NotifyCallEntry
         * @instance
         */
        NotifyCallEntry.prototype.name = "";
    
        /**
         * NotifyCallEntry tag.
         * @member {string} tag
         * @memberof NotifyCallEntry
         * @instance
         */
        NotifyCallEntry.prototype.tag = "";
    
        /**
         * Creates a new NotifyCallEntry instance using the specified properties.
         * @function create
         * @memberof NotifyCallEntry
         * @static
         * @param {INotifyCallEntry=} [properties] Properties to set
         * @returns {NotifyCallEntry} NotifyCallEntry instance
         */
        NotifyCallEntry.create = function create(properties) {
            return new NotifyCallEntry(properties);
        };
    
        /**
         * Encodes the specified NotifyCallEntry message. Does not implicitly {@link NotifyCallEntry.verify|verify} messages.
         * @function encode
         * @memberof NotifyCallEntry
         * @static
         * @param {INotifyCallEntry} message NotifyCallEntry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyCallEntry.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.instance != null && message.hasOwnProperty("instance"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.instance);
            if (message.utc != null && message.hasOwnProperty("utc"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.utc);
            if (message.localoffsetadd != null && message.hasOwnProperty("localoffsetadd"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.localoffsetadd);
            if (message.localoffsetsubtract != null && message.hasOwnProperty("localoffsetsubtract"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.localoffsetsubtract);
            if (message.datetime != null && message.hasOwnProperty("datetime"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.datetime);
            if (message.count != null && message.hasOwnProperty("count"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.count);
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.type);
            if (message.state != null && message.hasOwnProperty("state"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.state);
            if (message.duration != null && message.hasOwnProperty("duration"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.duration);
            if (message.number != null && message.hasOwnProperty("number"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.number);
            if (message.numbertype != null && message.hasOwnProperty("numbertype"))
                writer.uint32(/* id 11, wireType 0 =*/88).int32(message.numbertype);
            if (message.name != null && message.hasOwnProperty("name"))
                writer.uint32(/* id 12, wireType 2 =*/98).string(message.name);
            if (message.tag != null && message.hasOwnProperty("tag"))
                writer.uint32(/* id 13, wireType 2 =*/106).string(message.tag);
            return writer;
        };
    
        /**
         * Encodes the specified NotifyCallEntry message, length delimited. Does not implicitly {@link NotifyCallEntry.verify|verify} messages.
         * @function encodeDelimited
         * @memberof NotifyCallEntry
         * @static
         * @param {INotifyCallEntry} message NotifyCallEntry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyCallEntry.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a NotifyCallEntry message from the specified reader or buffer.
         * @function decode
         * @memberof NotifyCallEntry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {NotifyCallEntry} NotifyCallEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyCallEntry.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NotifyCallEntry();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.instance = reader.int32();
                    break;
                case 2:
                    message.utc = reader.int32();
                    break;
                case 3:
                    message.localoffsetadd = reader.int32();
                    break;
                case 4:
                    message.localoffsetsubtract = reader.int32();
                    break;
                case 5:
                    message.datetime = reader.string();
                    break;
                case 6:
                    message.count = reader.int32();
                    break;
                case 7:
                    message.type = reader.int32();
                    break;
                case 8:
                    message.state = reader.int32();
                    break;
                case 9:
                    message.duration = reader.int32();
                    break;
                case 10:
                    message.number = reader.string();
                    break;
                case 11:
                    message.numbertype = reader.int32();
                    break;
                case 12:
                    message.name = reader.string();
                    break;
                case 13:
                    message.tag = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a NotifyCallEntry message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof NotifyCallEntry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {NotifyCallEntry} NotifyCallEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyCallEntry.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a NotifyCallEntry message.
         * @function verify
         * @memberof NotifyCallEntry
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NotifyCallEntry.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.instance != null && message.hasOwnProperty("instance"))
                if (!$util.isInteger(message.instance))
                    return "instance: integer expected";
            if (message.utc != null && message.hasOwnProperty("utc"))
                if (!$util.isInteger(message.utc))
                    return "utc: integer expected";
            if (message.localoffsetadd != null && message.hasOwnProperty("localoffsetadd"))
                if (!$util.isInteger(message.localoffsetadd))
                    return "localoffsetadd: integer expected";
            if (message.localoffsetsubtract != null && message.hasOwnProperty("localoffsetsubtract"))
                if (!$util.isInteger(message.localoffsetsubtract))
                    return "localoffsetsubtract: integer expected";
            if (message.datetime != null && message.hasOwnProperty("datetime"))
                if (!$util.isString(message.datetime))
                    return "datetime: string expected";
            if (message.count != null && message.hasOwnProperty("count"))
                if (!$util.isInteger(message.count))
                    return "count: integer expected";
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                }
            if (message.state != null && message.hasOwnProperty("state"))
                switch (message.state) {
                default:
                    return "state: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.duration != null && message.hasOwnProperty("duration"))
                if (!$util.isInteger(message.duration))
                    return "duration: integer expected";
            if (message.number != null && message.hasOwnProperty("number"))
                if (!$util.isString(message.number))
                    return "number: string expected";
            if (message.numbertype != null && message.hasOwnProperty("numbertype"))
                if (!$util.isInteger(message.numbertype))
                    return "numbertype: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.tag != null && message.hasOwnProperty("tag"))
                if (!$util.isString(message.tag))
                    return "tag: string expected";
            return null;
        };
    
        /**
         * Creates a NotifyCallEntry message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof NotifyCallEntry
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {NotifyCallEntry} NotifyCallEntry
         */
        NotifyCallEntry.fromObject = function fromObject(object) {
            if (object instanceof $root.NotifyCallEntry)
                return object;
            var message = new $root.NotifyCallEntry();
            if (object.instance != null)
                message.instance = object.instance | 0;
            if (object.utc != null)
                message.utc = object.utc | 0;
            if (object.localoffsetadd != null)
                message.localoffsetadd = object.localoffsetadd | 0;
            if (object.localoffsetsubtract != null)
                message.localoffsetsubtract = object.localoffsetsubtract | 0;
            if (object.datetime != null)
                message.datetime = String(object.datetime);
            if (object.count != null)
                message.count = object.count | 0;
            switch (object.type) {
            case "Unspecified":
            case 0:
                message.type = 0;
                break;
            case "Answered":
            case 1:
                message.type = 1;
                break;
            case "Outbound":
            case 2:
                message.type = 2;
                break;
            case "Unanswered":
            case 3:
                message.type = 3;
                break;
            case "Answeredbyother":
            case 4:
                message.type = 4;
                break;
            case "Answeredbyvoicemail":
            case 5:
                message.type = 5;
                break;
            }
            switch (object.state) {
            case "Unknown":
            case 0:
                message.state = 0;
                break;
            case "Unread":
            case 1:
                message.state = 1;
                break;
            case "Read":
            case 2:
                message.state = 2;
                break;
            case "Saved":
            case 3:
                message.state = 3;
                break;
            }
            if (object.duration != null)
                message.duration = object.duration | 0;
            if (object.number != null)
                message.number = String(object.number);
            if (object.numbertype != null)
                message.numbertype = object.numbertype | 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.tag != null)
                message.tag = String(object.tag);
            return message;
        };
    
        /**
         * Creates a plain object from a NotifyCallEntry message. Also converts values to other types if specified.
         * @function toObject
         * @memberof NotifyCallEntry
         * @static
         * @param {NotifyCallEntry} message NotifyCallEntry
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NotifyCallEntry.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.instance = 0;
                object.utc = 0;
                object.localoffsetadd = 0;
                object.localoffsetsubtract = 0;
                object.datetime = "";
                object.count = 0;
                object.type = options.enums === String ? "Unspecified" : 0;
                object.state = options.enums === String ? "Unknown" : 0;
                object.duration = 0;
                object.number = "";
                object.numbertype = 0;
                object.name = "";
                object.tag = "";
            }
            if (message.instance != null && message.hasOwnProperty("instance"))
                object.instance = message.instance;
            if (message.utc != null && message.hasOwnProperty("utc"))
                object.utc = message.utc;
            if (message.localoffsetadd != null && message.hasOwnProperty("localoffsetadd"))
                object.localoffsetadd = message.localoffsetadd;
            if (message.localoffsetsubtract != null && message.hasOwnProperty("localoffsetsubtract"))
                object.localoffsetsubtract = message.localoffsetsubtract;
            if (message.datetime != null && message.hasOwnProperty("datetime"))
                object.datetime = message.datetime;
            if (message.count != null && message.hasOwnProperty("count"))
                object.count = message.count;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.NotifyCallEntry.Type[message.type] : message.type;
            if (message.state != null && message.hasOwnProperty("state"))
                object.state = options.enums === String ? $root.NotifyCallEntry.State[message.state] : message.state;
            if (message.duration != null && message.hasOwnProperty("duration"))
                object.duration = message.duration;
            if (message.number != null && message.hasOwnProperty("number"))
                object.number = message.number;
            if (message.numbertype != null && message.hasOwnProperty("numbertype"))
                object.numbertype = message.numbertype;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.tag != null && message.hasOwnProperty("tag"))
                object.tag = message.tag;
            return object;
        };
    
        /**
         * Converts this NotifyCallEntry to JSON.
         * @function toJSON
         * @memberof NotifyCallEntry
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NotifyCallEntry.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * State enum.
         * @name NotifyCallEntry.State
         * @enum {string}
         * @property {number} Unknown=0 Unknown value
         * @property {number} Unread=1 Unread value
         * @property {number} Read=2 Read value
         * @property {number} Saved=3 Saved value
         */
        NotifyCallEntry.State = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "Unknown"] = 0;
            values[valuesById[1] = "Unread"] = 1;
            values[valuesById[2] = "Read"] = 2;
            values[valuesById[3] = "Saved"] = 3;
            return values;
        })();
    
        /**
         * Type enum.
         * @name NotifyCallEntry.Type
         * @enum {string}
         * @property {number} Unspecified=0 Unspecified value
         * @property {number} Answered=1 Answered value
         * @property {number} Outbound=2 Outbound value
         * @property {number} Unanswered=3 Unanswered value
         * @property {number} Answeredbyother=4 Answeredbyother value
         * @property {number} Answeredbyvoicemail=5 Answeredbyvoicemail value
         */
        NotifyCallEntry.Type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "Unspecified"] = 0;
            values[valuesById[1] = "Answered"] = 1;
            values[valuesById[2] = "Outbound"] = 2;
            values[valuesById[3] = "Unanswered"] = 3;
            values[valuesById[4] = "Answeredbyother"] = 4;
            values[valuesById[5] = "Answeredbyvoicemail"] = 5;
            return values;
        })();
    
        return NotifyCallEntry;
    })();
    
    $root.NotifyCallDeleted = (function() {
    
        /**
         * Properties of a NotifyCallDeleted.
         * @exports INotifyCallDeleted
         * @interface INotifyCallDeleted
         * @property {number|null} [instance] NotifyCallDeleted instance
         */
    
        /**
         * Constructs a new NotifyCallDeleted.
         * @exports NotifyCallDeleted
         * @classdesc Represents a NotifyCallDeleted.
         * @implements INotifyCallDeleted
         * @constructor
         * @param {INotifyCallDeleted=} [properties] Properties to set
         */
        function NotifyCallDeleted(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * NotifyCallDeleted instance.
         * @member {number} instance
         * @memberof NotifyCallDeleted
         * @instance
         */
        NotifyCallDeleted.prototype.instance = 0;
    
        /**
         * Creates a new NotifyCallDeleted instance using the specified properties.
         * @function create
         * @memberof NotifyCallDeleted
         * @static
         * @param {INotifyCallDeleted=} [properties] Properties to set
         * @returns {NotifyCallDeleted} NotifyCallDeleted instance
         */
        NotifyCallDeleted.create = function create(properties) {
            return new NotifyCallDeleted(properties);
        };
    
        /**
         * Encodes the specified NotifyCallDeleted message. Does not implicitly {@link NotifyCallDeleted.verify|verify} messages.
         * @function encode
         * @memberof NotifyCallDeleted
         * @static
         * @param {INotifyCallDeleted} message NotifyCallDeleted message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyCallDeleted.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.instance != null && message.hasOwnProperty("instance"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.instance);
            return writer;
        };
    
        /**
         * Encodes the specified NotifyCallDeleted message, length delimited. Does not implicitly {@link NotifyCallDeleted.verify|verify} messages.
         * @function encodeDelimited
         * @memberof NotifyCallDeleted
         * @static
         * @param {INotifyCallDeleted} message NotifyCallDeleted message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyCallDeleted.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a NotifyCallDeleted message from the specified reader or buffer.
         * @function decode
         * @memberof NotifyCallDeleted
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {NotifyCallDeleted} NotifyCallDeleted
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyCallDeleted.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NotifyCallDeleted();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.instance = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a NotifyCallDeleted message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof NotifyCallDeleted
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {NotifyCallDeleted} NotifyCallDeleted
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyCallDeleted.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a NotifyCallDeleted message.
         * @function verify
         * @memberof NotifyCallDeleted
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NotifyCallDeleted.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.instance != null && message.hasOwnProperty("instance"))
                if (!$util.isInteger(message.instance))
                    return "instance: integer expected";
            return null;
        };
    
        /**
         * Creates a NotifyCallDeleted message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof NotifyCallDeleted
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {NotifyCallDeleted} NotifyCallDeleted
         */
        NotifyCallDeleted.fromObject = function fromObject(object) {
            if (object instanceof $root.NotifyCallDeleted)
                return object;
            var message = new $root.NotifyCallDeleted();
            if (object.instance != null)
                message.instance = object.instance | 0;
            return message;
        };
    
        /**
         * Creates a plain object from a NotifyCallDeleted message. Also converts values to other types if specified.
         * @function toObject
         * @memberof NotifyCallDeleted
         * @static
         * @param {NotifyCallDeleted} message NotifyCallDeleted
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NotifyCallDeleted.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.instance = 0;
            if (message.instance != null && message.hasOwnProperty("instance"))
                object.instance = message.instance;
            return object;
        };
    
        /**
         * Converts this NotifyCallDeleted to JSON.
         * @function toJSON
         * @memberof NotifyCallDeleted
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NotifyCallDeleted.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return NotifyCallDeleted;
    })();
    
    $root.NotifyCallLog = (function() {
    
        /**
         * Properties of a NotifyCallLog.
         * @exports INotifyCallLog
         * @interface INotifyCallLog
         * @property {boolean|null} [full] NotifyCallLog full
         * @property {Array.<INotifyCallEntry>|null} [entry] NotifyCallLog entry
         * @property {Array.<INotifyCallDeleted>|null} [deleted] NotifyCallLog deleted
         */
    
        /**
         * Constructs a new NotifyCallLog.
         * @exports NotifyCallLog
         * @classdesc Represents a NotifyCallLog.
         * @implements INotifyCallLog
         * @constructor
         * @param {INotifyCallLog=} [properties] Properties to set
         */
        function NotifyCallLog(properties) {
            this.entry = [];
            this.deleted = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * NotifyCallLog full.
         * @member {boolean} full
         * @memberof NotifyCallLog
         * @instance
         */
        NotifyCallLog.prototype.full = false;
    
        /**
         * NotifyCallLog entry.
         * @member {Array.<INotifyCallEntry>} entry
         * @memberof NotifyCallLog
         * @instance
         */
        NotifyCallLog.prototype.entry = $util.emptyArray;
    
        /**
         * NotifyCallLog deleted.
         * @member {Array.<INotifyCallDeleted>} deleted
         * @memberof NotifyCallLog
         * @instance
         */
        NotifyCallLog.prototype.deleted = $util.emptyArray;
    
        /**
         * Creates a new NotifyCallLog instance using the specified properties.
         * @function create
         * @memberof NotifyCallLog
         * @static
         * @param {INotifyCallLog=} [properties] Properties to set
         * @returns {NotifyCallLog} NotifyCallLog instance
         */
        NotifyCallLog.create = function create(properties) {
            return new NotifyCallLog(properties);
        };
    
        /**
         * Encodes the specified NotifyCallLog message. Does not implicitly {@link NotifyCallLog.verify|verify} messages.
         * @function encode
         * @memberof NotifyCallLog
         * @static
         * @param {INotifyCallLog} message NotifyCallLog message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyCallLog.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.full != null && message.hasOwnProperty("full"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.full);
            if (message.entry != null && message.entry.length)
                for (var i = 0; i < message.entry.length; ++i)
                    $root.NotifyCallEntry.encode(message.entry[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.deleted != null && message.deleted.length)
                for (var i = 0; i < message.deleted.length; ++i)
                    $root.NotifyCallDeleted.encode(message.deleted[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified NotifyCallLog message, length delimited. Does not implicitly {@link NotifyCallLog.verify|verify} messages.
         * @function encodeDelimited
         * @memberof NotifyCallLog
         * @static
         * @param {INotifyCallLog} message NotifyCallLog message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyCallLog.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a NotifyCallLog message from the specified reader or buffer.
         * @function decode
         * @memberof NotifyCallLog
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {NotifyCallLog} NotifyCallLog
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyCallLog.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NotifyCallLog();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.full = reader.bool();
                    break;
                case 2:
                    if (!(message.entry && message.entry.length))
                        message.entry = [];
                    message.entry.push($root.NotifyCallEntry.decode(reader, reader.uint32()));
                    break;
                case 3:
                    if (!(message.deleted && message.deleted.length))
                        message.deleted = [];
                    message.deleted.push($root.NotifyCallDeleted.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a NotifyCallLog message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof NotifyCallLog
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {NotifyCallLog} NotifyCallLog
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyCallLog.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a NotifyCallLog message.
         * @function verify
         * @memberof NotifyCallLog
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NotifyCallLog.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.full != null && message.hasOwnProperty("full"))
                if (typeof message.full !== "boolean")
                    return "full: boolean expected";
            if (message.entry != null && message.hasOwnProperty("entry")) {
                if (!Array.isArray(message.entry))
                    return "entry: array expected";
                for (var i = 0; i < message.entry.length; ++i) {
                    var error = $root.NotifyCallEntry.verify(message.entry[i]);
                    if (error)
                        return "entry." + error;
                }
            }
            if (message.deleted != null && message.hasOwnProperty("deleted")) {
                if (!Array.isArray(message.deleted))
                    return "deleted: array expected";
                for (var i = 0; i < message.deleted.length; ++i) {
                    var error = $root.NotifyCallDeleted.verify(message.deleted[i]);
                    if (error)
                        return "deleted." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a NotifyCallLog message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof NotifyCallLog
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {NotifyCallLog} NotifyCallLog
         */
        NotifyCallLog.fromObject = function fromObject(object) {
            if (object instanceof $root.NotifyCallLog)
                return object;
            var message = new $root.NotifyCallLog();
            if (object.full != null)
                message.full = Boolean(object.full);
            if (object.entry) {
                if (!Array.isArray(object.entry))
                    throw TypeError(".NotifyCallLog.entry: array expected");
                message.entry = [];
                for (var i = 0; i < object.entry.length; ++i) {
                    if (typeof object.entry[i] !== "object")
                        throw TypeError(".NotifyCallLog.entry: object expected");
                    message.entry[i] = $root.NotifyCallEntry.fromObject(object.entry[i]);
                }
            }
            if (object.deleted) {
                if (!Array.isArray(object.deleted))
                    throw TypeError(".NotifyCallLog.deleted: array expected");
                message.deleted = [];
                for (var i = 0; i < object.deleted.length; ++i) {
                    if (typeof object.deleted[i] !== "object")
                        throw TypeError(".NotifyCallLog.deleted: object expected");
                    message.deleted[i] = $root.NotifyCallDeleted.fromObject(object.deleted[i]);
                }
            }
            return message;
        };
    
        /**
         * Creates a plain object from a NotifyCallLog message. Also converts values to other types if specified.
         * @function toObject
         * @memberof NotifyCallLog
         * @static
         * @param {NotifyCallLog} message NotifyCallLog
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NotifyCallLog.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.entry = [];
                object.deleted = [];
            }
            if (options.defaults)
                object.full = false;
            if (message.full != null && message.hasOwnProperty("full"))
                object.full = message.full;
            if (message.entry && message.entry.length) {
                object.entry = [];
                for (var j = 0; j < message.entry.length; ++j)
                    object.entry[j] = $root.NotifyCallEntry.toObject(message.entry[j], options);
            }
            if (message.deleted && message.deleted.length) {
                object.deleted = [];
                for (var j = 0; j < message.deleted.length; ++j)
                    object.deleted[j] = $root.NotifyCallDeleted.toObject(message.deleted[j], options);
            }
            return object;
        };
    
        /**
         * Converts this NotifyCallLog to JSON.
         * @function toJSON
         * @memberof NotifyCallLog
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NotifyCallLog.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return NotifyCallLog;
    })();
    
    $root.UpdateCallLog = (function() {
    
        /**
         * Properties of an UpdateCallLog.
         * @exports IUpdateCallLog
         * @interface IUpdateCallLog
         * @property {UpdateCallLog.Action|null} [action] UpdateCallLog action
         * @property {number|null} [instance] UpdateCallLog instance
         */
    
        /**
         * Constructs a new UpdateCallLog.
         * @exports UpdateCallLog
         * @classdesc Represents an UpdateCallLog.
         * @implements IUpdateCallLog
         * @constructor
         * @param {IUpdateCallLog=} [properties] Properties to set
         */
        function UpdateCallLog(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * UpdateCallLog action.
         * @member {UpdateCallLog.Action} action
         * @memberof UpdateCallLog
         * @instance
         */
        UpdateCallLog.prototype.action = 0;
    
        /**
         * UpdateCallLog instance.
         * @member {number} instance
         * @memberof UpdateCallLog
         * @instance
         */
        UpdateCallLog.prototype.instance = 0;
    
        /**
         * Creates a new UpdateCallLog instance using the specified properties.
         * @function create
         * @memberof UpdateCallLog
         * @static
         * @param {IUpdateCallLog=} [properties] Properties to set
         * @returns {UpdateCallLog} UpdateCallLog instance
         */
        UpdateCallLog.create = function create(properties) {
            return new UpdateCallLog(properties);
        };
    
        /**
         * Encodes the specified UpdateCallLog message. Does not implicitly {@link UpdateCallLog.verify|verify} messages.
         * @function encode
         * @memberof UpdateCallLog
         * @static
         * @param {IUpdateCallLog} message UpdateCallLog message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateCallLog.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.action != null && message.hasOwnProperty("action"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.action);
            if (message.instance != null && message.hasOwnProperty("instance"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.instance);
            return writer;
        };
    
        /**
         * Encodes the specified UpdateCallLog message, length delimited. Does not implicitly {@link UpdateCallLog.verify|verify} messages.
         * @function encodeDelimited
         * @memberof UpdateCallLog
         * @static
         * @param {IUpdateCallLog} message UpdateCallLog message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateCallLog.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an UpdateCallLog message from the specified reader or buffer.
         * @function decode
         * @memberof UpdateCallLog
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {UpdateCallLog} UpdateCallLog
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateCallLog.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UpdateCallLog();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.action = reader.int32();
                    break;
                case 2:
                    message.instance = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an UpdateCallLog message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof UpdateCallLog
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {UpdateCallLog} UpdateCallLog
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateCallLog.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an UpdateCallLog message.
         * @function verify
         * @memberof UpdateCallLog
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateCallLog.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.action != null && message.hasOwnProperty("action"))
                switch (message.action) {
                default:
                    return "action: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                    break;
                }
            if (message.instance != null && message.hasOwnProperty("instance"))
                if (!$util.isInteger(message.instance))
                    return "instance: integer expected";
            return null;
        };
    
        /**
         * Creates an UpdateCallLog message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof UpdateCallLog
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {UpdateCallLog} UpdateCallLog
         */
        UpdateCallLog.fromObject = function fromObject(object) {
            if (object instanceof $root.UpdateCallLog)
                return object;
            var message = new $root.UpdateCallLog();
            switch (object.action) {
            case "Unspecified":
            case 0:
                message.action = 0;
                break;
            case "Refresh":
            case 1:
                message.action = 1;
                break;
            case "Deleteall":
            case 2:
                message.action = 2;
                break;
            case "Deleteallunsaved":
            case 3:
                message.action = 3;
                break;
            case "Deletealloutbound":
            case 4:
                message.action = 4;
                break;
            case "Deleteallinbound":
            case 5:
                message.action = 5;
                break;
            case "Readall":
            case 6:
                message.action = 6;
                break;
            case "Deleteinst":
            case 7:
                message.action = 7;
                break;
            case "Readinst":
            case 8:
                message.action = 8;
                break;
            case "Saveinst":
            case 9:
                message.action = 9;
                break;
            case "Unreadinst":
            case 10:
                message.action = 10;
                break;
            }
            if (object.instance != null)
                message.instance = object.instance | 0;
            return message;
        };
    
        /**
         * Creates a plain object from an UpdateCallLog message. Also converts values to other types if specified.
         * @function toObject
         * @memberof UpdateCallLog
         * @static
         * @param {UpdateCallLog} message UpdateCallLog
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateCallLog.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.action = options.enums === String ? "Unspecified" : 0;
                object.instance = 0;
            }
            if (message.action != null && message.hasOwnProperty("action"))
                object.action = options.enums === String ? $root.UpdateCallLog.Action[message.action] : message.action;
            if (message.instance != null && message.hasOwnProperty("instance"))
                object.instance = message.instance;
            return object;
        };
    
        /**
         * Converts this UpdateCallLog to JSON.
         * @function toJSON
         * @memberof UpdateCallLog
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateCallLog.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Action enum.
         * @name UpdateCallLog.Action
         * @enum {string}
         * @property {number} Unspecified=0 Unspecified value
         * @property {number} Refresh=1 Refresh value
         * @property {number} Deleteall=2 Deleteall value
         * @property {number} Deleteallunsaved=3 Deleteallunsaved value
         * @property {number} Deletealloutbound=4 Deletealloutbound value
         * @property {number} Deleteallinbound=5 Deleteallinbound value
         * @property {number} Readall=6 Readall value
         * @property {number} Deleteinst=7 Deleteinst value
         * @property {number} Readinst=8 Readinst value
         * @property {number} Saveinst=9 Saveinst value
         * @property {number} Unreadinst=10 Unreadinst value
         */
        UpdateCallLog.Action = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "Unspecified"] = 0;
            values[valuesById[1] = "Refresh"] = 1;
            values[valuesById[2] = "Deleteall"] = 2;
            values[valuesById[3] = "Deleteallunsaved"] = 3;
            values[valuesById[4] = "Deletealloutbound"] = 4;
            values[valuesById[5] = "Deleteallinbound"] = 5;
            values[valuesById[6] = "Readall"] = 6;
            values[valuesById[7] = "Deleteinst"] = 7;
            values[valuesById[8] = "Readinst"] = 8;
            values[valuesById[9] = "Saveinst"] = 9;
            values[valuesById[10] = "Unreadinst"] = 10;
            return values;
        })();
    
        return UpdateCallLog;
    })();
    
    $root.PartyInfo = (function() {
    
        /**
         * Properties of a PartyInfo.
         * @exports IPartyInfo
         * @interface IPartyInfo
         * @property {number|null} [numbertype] PartyInfo numbertype
         * @property {string|null} [number] PartyInfo number
         * @property {string|null} [name] PartyInfo name
         * @property {number|null} [nametype] PartyInfo nametype
         * @property {boolean|null} [withheld] PartyInfo withheld
         * @property {number|null} [diversionreason] PartyInfo diversionreason
         */
    
        /**
         * Constructs a new PartyInfo.
         * @exports PartyInfo
         * @classdesc Represents a PartyInfo.
         * @implements IPartyInfo
         * @constructor
         * @param {IPartyInfo=} [properties] Properties to set
         */
        function PartyInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * PartyInfo numbertype.
         * @member {number} numbertype
         * @memberof PartyInfo
         * @instance
         */
        PartyInfo.prototype.numbertype = 0;
    
        /**
         * PartyInfo number.
         * @member {string} number
         * @memberof PartyInfo
         * @instance
         */
        PartyInfo.prototype.number = "";
    
        /**
         * PartyInfo name.
         * @member {string} name
         * @memberof PartyInfo
         * @instance
         */
        PartyInfo.prototype.name = "";
    
        /**
         * PartyInfo nametype.
         * @member {number} nametype
         * @memberof PartyInfo
         * @instance
         */
        PartyInfo.prototype.nametype = 0;
    
        /**
         * PartyInfo withheld.
         * @member {boolean} withheld
         * @memberof PartyInfo
         * @instance
         */
        PartyInfo.prototype.withheld = false;
    
        /**
         * PartyInfo diversionreason.
         * @member {number} diversionreason
         * @memberof PartyInfo
         * @instance
         */
        PartyInfo.prototype.diversionreason = 0;
    
        /**
         * Creates a new PartyInfo instance using the specified properties.
         * @function create
         * @memberof PartyInfo
         * @static
         * @param {IPartyInfo=} [properties] Properties to set
         * @returns {PartyInfo} PartyInfo instance
         */
        PartyInfo.create = function create(properties) {
            return new PartyInfo(properties);
        };
    
        /**
         * Encodes the specified PartyInfo message. Does not implicitly {@link PartyInfo.verify|verify} messages.
         * @function encode
         * @memberof PartyInfo
         * @static
         * @param {IPartyInfo} message PartyInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PartyInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.numbertype != null && message.hasOwnProperty("numbertype"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.numbertype);
            if (message.number != null && message.hasOwnProperty("number"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.number);
            if (message.name != null && message.hasOwnProperty("name"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.name);
            if (message.nametype != null && message.hasOwnProperty("nametype"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.nametype);
            if (message.withheld != null && message.hasOwnProperty("withheld"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.withheld);
            if (message.diversionreason != null && message.hasOwnProperty("diversionreason"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.diversionreason);
            return writer;
        };
    
        /**
         * Encodes the specified PartyInfo message, length delimited. Does not implicitly {@link PartyInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof PartyInfo
         * @static
         * @param {IPartyInfo} message PartyInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PartyInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a PartyInfo message from the specified reader or buffer.
         * @function decode
         * @memberof PartyInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {PartyInfo} PartyInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PartyInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PartyInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.numbertype = reader.int32();
                    break;
                case 2:
                    message.number = reader.string();
                    break;
                case 4:
                    message.name = reader.string();
                    break;
                case 5:
                    message.nametype = reader.int32();
                    break;
                case 6:
                    message.withheld = reader.bool();
                    break;
                case 7:
                    message.diversionreason = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a PartyInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof PartyInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {PartyInfo} PartyInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PartyInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a PartyInfo message.
         * @function verify
         * @memberof PartyInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PartyInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.numbertype != null && message.hasOwnProperty("numbertype"))
                if (!$util.isInteger(message.numbertype))
                    return "numbertype: integer expected";
            if (message.number != null && message.hasOwnProperty("number"))
                if (!$util.isString(message.number))
                    return "number: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.nametype != null && message.hasOwnProperty("nametype"))
                if (!$util.isInteger(message.nametype))
                    return "nametype: integer expected";
            if (message.withheld != null && message.hasOwnProperty("withheld"))
                if (typeof message.withheld !== "boolean")
                    return "withheld: boolean expected";
            if (message.diversionreason != null && message.hasOwnProperty("diversionreason"))
                if (!$util.isInteger(message.diversionreason))
                    return "diversionreason: integer expected";
            return null;
        };
    
        /**
         * Creates a PartyInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof PartyInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {PartyInfo} PartyInfo
         */
        PartyInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.PartyInfo)
                return object;
            var message = new $root.PartyInfo();
            if (object.numbertype != null)
                message.numbertype = object.numbertype | 0;
            if (object.number != null)
                message.number = String(object.number);
            if (object.name != null)
                message.name = String(object.name);
            if (object.nametype != null)
                message.nametype = object.nametype | 0;
            if (object.withheld != null)
                message.withheld = Boolean(object.withheld);
            if (object.diversionreason != null)
                message.diversionreason = object.diversionreason | 0;
            return message;
        };
    
        /**
         * Creates a plain object from a PartyInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof PartyInfo
         * @static
         * @param {PartyInfo} message PartyInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PartyInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.numbertype = 0;
                object.number = "";
                object.name = "";
                object.nametype = 0;
                object.withheld = false;
                object.diversionreason = 0;
            }
            if (message.numbertype != null && message.hasOwnProperty("numbertype"))
                object.numbertype = message.numbertype;
            if (message.number != null && message.hasOwnProperty("number"))
                object.number = message.number;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.nametype != null && message.hasOwnProperty("nametype"))
                object.nametype = message.nametype;
            if (message.withheld != null && message.hasOwnProperty("withheld"))
                object.withheld = message.withheld;
            if (message.diversionreason != null && message.hasOwnProperty("diversionreason"))
                object.diversionreason = message.diversionreason;
            return object;
        };
    
        /**
         * Converts this PartyInfo to JSON.
         * @function toJSON
         * @memberof PartyInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PartyInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return PartyInfo;
    })();
    
    $root.DialInfo = (function() {
    
        /**
         * Properties of a DialInfo.
         * @exports IDialInfo
         * @interface IDialInfo
         * @property {string|null} [number] DialInfo number
         * @property {number|null} [type] DialInfo type
         * @property {boolean|null} [withholdcli] DialInfo withholdcli
         * @property {boolean|null} [hidenumber] DialInfo hidenumber
         * @property {boolean|null} [complete] DialInfo complete
         * @property {string|null} [madn] DialInfo madn
         */
    
        /**
         * Constructs a new DialInfo.
         * @exports DialInfo
         * @classdesc Represents a DialInfo.
         * @implements IDialInfo
         * @constructor
         * @param {IDialInfo=} [properties] Properties to set
         */
        function DialInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * DialInfo number.
         * @member {string} number
         * @memberof DialInfo
         * @instance
         */
        DialInfo.prototype.number = "";
    
        /**
         * DialInfo type.
         * @member {number} type
         * @memberof DialInfo
         * @instance
         */
        DialInfo.prototype.type = 0;
    
        /**
         * DialInfo withholdcli.
         * @member {boolean} withholdcli
         * @memberof DialInfo
         * @instance
         */
        DialInfo.prototype.withholdcli = false;
    
        /**
         * DialInfo hidenumber.
         * @member {boolean} hidenumber
         * @memberof DialInfo
         * @instance
         */
        DialInfo.prototype.hidenumber = false;
    
        /**
         * DialInfo complete.
         * @member {boolean} complete
         * @memberof DialInfo
         * @instance
         */
        DialInfo.prototype.complete = false;
    
        /**
         * DialInfo madn.
         * @member {string} madn
         * @memberof DialInfo
         * @instance
         */
        DialInfo.prototype.madn = "";
    
        /**
         * Creates a new DialInfo instance using the specified properties.
         * @function create
         * @memberof DialInfo
         * @static
         * @param {IDialInfo=} [properties] Properties to set
         * @returns {DialInfo} DialInfo instance
         */
        DialInfo.create = function create(properties) {
            return new DialInfo(properties);
        };
    
        /**
         * Encodes the specified DialInfo message. Does not implicitly {@link DialInfo.verify|verify} messages.
         * @function encode
         * @memberof DialInfo
         * @static
         * @param {IDialInfo} message DialInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DialInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.number != null && message.hasOwnProperty("number"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.number);
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.type);
            if (message.withholdcli != null && message.hasOwnProperty("withholdcli"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.withholdcli);
            if (message.hidenumber != null && message.hasOwnProperty("hidenumber"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.hidenumber);
            if (message.complete != null && message.hasOwnProperty("complete"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.complete);
            if (message.madn != null && message.hasOwnProperty("madn"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.madn);
            return writer;
        };
    
        /**
         * Encodes the specified DialInfo message, length delimited. Does not implicitly {@link DialInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof DialInfo
         * @static
         * @param {IDialInfo} message DialInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DialInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a DialInfo message from the specified reader or buffer.
         * @function decode
         * @memberof DialInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {DialInfo} DialInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DialInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DialInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.number = reader.string();
                    break;
                case 2:
                    message.type = reader.int32();
                    break;
                case 3:
                    message.withholdcli = reader.bool();
                    break;
                case 4:
                    message.hidenumber = reader.bool();
                    break;
                case 5:
                    message.complete = reader.bool();
                    break;
                case 6:
                    message.madn = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a DialInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof DialInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {DialInfo} DialInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DialInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a DialInfo message.
         * @function verify
         * @memberof DialInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DialInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.number != null && message.hasOwnProperty("number"))
                if (!$util.isString(message.number))
                    return "number: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isInteger(message.type))
                    return "type: integer expected";
            if (message.withholdcli != null && message.hasOwnProperty("withholdcli"))
                if (typeof message.withholdcli !== "boolean")
                    return "withholdcli: boolean expected";
            if (message.hidenumber != null && message.hasOwnProperty("hidenumber"))
                if (typeof message.hidenumber !== "boolean")
                    return "hidenumber: boolean expected";
            if (message.complete != null && message.hasOwnProperty("complete"))
                if (typeof message.complete !== "boolean")
                    return "complete: boolean expected";
            if (message.madn != null && message.hasOwnProperty("madn"))
                if (!$util.isString(message.madn))
                    return "madn: string expected";
            return null;
        };
    
        /**
         * Creates a DialInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof DialInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {DialInfo} DialInfo
         */
        DialInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.DialInfo)
                return object;
            var message = new $root.DialInfo();
            if (object.number != null)
                message.number = String(object.number);
            if (object.type != null)
                message.type = object.type | 0;
            if (object.withholdcli != null)
                message.withholdcli = Boolean(object.withholdcli);
            if (object.hidenumber != null)
                message.hidenumber = Boolean(object.hidenumber);
            if (object.complete != null)
                message.complete = Boolean(object.complete);
            if (object.madn != null)
                message.madn = String(object.madn);
            return message;
        };
    
        /**
         * Creates a plain object from a DialInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof DialInfo
         * @static
         * @param {DialInfo} message DialInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DialInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.number = "";
                object.type = 0;
                object.withholdcli = false;
                object.hidenumber = false;
                object.complete = false;
                object.madn = "";
            }
            if (message.number != null && message.hasOwnProperty("number"))
                object.number = message.number;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.withholdcli != null && message.hasOwnProperty("withholdcli"))
                object.withholdcli = message.withholdcli;
            if (message.hidenumber != null && message.hasOwnProperty("hidenumber"))
                object.hidenumber = message.hidenumber;
            if (message.complete != null && message.hasOwnProperty("complete"))
                object.complete = message.complete;
            if (message.madn != null && message.hasOwnProperty("madn"))
                object.madn = message.madn;
            return object;
        };
    
        /**
         * Converts this DialInfo to JSON.
         * @function toJSON
         * @memberof DialInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DialInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return DialInfo;
    })();
    
    $root.CallData = (function() {
    
        /**
         * Properties of a CallData.
         * @exports ICallData
         * @interface ICallData
         * @property {string|null} [language] CallData language
         * @property {boolean|null} [emergency] CallData emergency
         * @property {boolean|null} [privacy] CallData privacy
         * @property {boolean|null} [secure] CallData secure
         * @property {boolean|null} [rprivacy] CallData rprivacy
         */
    
        /**
         * Constructs a new CallData.
         * @exports CallData
         * @classdesc Represents a CallData.
         * @implements ICallData
         * @constructor
         * @param {ICallData=} [properties] Properties to set
         */
        function CallData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * CallData language.
         * @member {string} language
         * @memberof CallData
         * @instance
         */
        CallData.prototype.language = "";
    
        /**
         * CallData emergency.
         * @member {boolean} emergency
         * @memberof CallData
         * @instance
         */
        CallData.prototype.emergency = false;
    
        /**
         * CallData privacy.
         * @member {boolean} privacy
         * @memberof CallData
         * @instance
         */
        CallData.prototype.privacy = false;
    
        /**
         * CallData secure.
         * @member {boolean} secure
         * @memberof CallData
         * @instance
         */
        CallData.prototype.secure = false;
    
        /**
         * CallData rprivacy.
         * @member {boolean} rprivacy
         * @memberof CallData
         * @instance
         */
        CallData.prototype.rprivacy = false;
    
        /**
         * Creates a new CallData instance using the specified properties.
         * @function create
         * @memberof CallData
         * @static
         * @param {ICallData=} [properties] Properties to set
         * @returns {CallData} CallData instance
         */
        CallData.create = function create(properties) {
            return new CallData(properties);
        };
    
        /**
         * Encodes the specified CallData message. Does not implicitly {@link CallData.verify|verify} messages.
         * @function encode
         * @memberof CallData
         * @static
         * @param {ICallData} message CallData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CallData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.language != null && message.hasOwnProperty("language"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.language);
            if (message.emergency != null && message.hasOwnProperty("emergency"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.emergency);
            if (message.privacy != null && message.hasOwnProperty("privacy"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.privacy);
            if (message.secure != null && message.hasOwnProperty("secure"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.secure);
            if (message.rprivacy != null && message.hasOwnProperty("rprivacy"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.rprivacy);
            return writer;
        };
    
        /**
         * Encodes the specified CallData message, length delimited. Does not implicitly {@link CallData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof CallData
         * @static
         * @param {ICallData} message CallData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CallData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a CallData message from the specified reader or buffer.
         * @function decode
         * @memberof CallData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {CallData} CallData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CallData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CallData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.language = reader.string();
                    break;
                case 2:
                    message.emergency = reader.bool();
                    break;
                case 3:
                    message.privacy = reader.bool();
                    break;
                case 4:
                    message.secure = reader.bool();
                    break;
                case 5:
                    message.rprivacy = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a CallData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof CallData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {CallData} CallData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CallData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a CallData message.
         * @function verify
         * @memberof CallData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CallData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.language != null && message.hasOwnProperty("language"))
                if (!$util.isString(message.language))
                    return "language: string expected";
            if (message.emergency != null && message.hasOwnProperty("emergency"))
                if (typeof message.emergency !== "boolean")
                    return "emergency: boolean expected";
            if (message.privacy != null && message.hasOwnProperty("privacy"))
                if (typeof message.privacy !== "boolean")
                    return "privacy: boolean expected";
            if (message.secure != null && message.hasOwnProperty("secure"))
                if (typeof message.secure !== "boolean")
                    return "secure: boolean expected";
            if (message.rprivacy != null && message.hasOwnProperty("rprivacy"))
                if (typeof message.rprivacy !== "boolean")
                    return "rprivacy: boolean expected";
            return null;
        };
    
        /**
         * Creates a CallData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof CallData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {CallData} CallData
         */
        CallData.fromObject = function fromObject(object) {
            if (object instanceof $root.CallData)
                return object;
            var message = new $root.CallData();
            if (object.language != null)
                message.language = String(object.language);
            if (object.emergency != null)
                message.emergency = Boolean(object.emergency);
            if (object.privacy != null)
                message.privacy = Boolean(object.privacy);
            if (object.secure != null)
                message.secure = Boolean(object.secure);
            if (object.rprivacy != null)
                message.rprivacy = Boolean(object.rprivacy);
            return message;
        };
    
        /**
         * Creates a plain object from a CallData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof CallData
         * @static
         * @param {CallData} message CallData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CallData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.language = "";
                object.emergency = false;
                object.privacy = false;
                object.secure = false;
                object.rprivacy = false;
            }
            if (message.language != null && message.hasOwnProperty("language"))
                object.language = message.language;
            if (message.emergency != null && message.hasOwnProperty("emergency"))
                object.emergency = message.emergency;
            if (message.privacy != null && message.hasOwnProperty("privacy"))
                object.privacy = message.privacy;
            if (message.secure != null && message.hasOwnProperty("secure"))
                object.secure = message.secure;
            if (message.rprivacy != null && message.hasOwnProperty("rprivacy"))
                object.rprivacy = message.rprivacy;
            return object;
        };
    
        /**
         * Converts this CallData to JSON.
         * @function toJSON
         * @memberof CallData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CallData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return CallData;
    })();
    
    $root.ConferenceMember = (function() {
    
        /**
         * Properties of a ConferenceMember.
         * @exports IConferenceMember
         * @interface IConferenceMember
         * @property {ConferenceMember.Payload|null} [payload] ConferenceMember payload
         * @property {number|null} [lref] ConferenceMember lref
         * @property {ConferenceMember.State|null} [state] ConferenceMember state
         * @property {ConferenceMember.Direction|null} [direction] ConferenceMember direction
         * @property {boolean|null} [activeheld] ConferenceMember activeheld
         * @property {string|null} [calledparty] ConferenceMember calledparty
         * @property {IPartyInfo|null} [connectedparty] ConferenceMember connectedparty
         * @property {boolean|null} [mute] ConferenceMember mute
         * @property {ConferenceMember.FailedCause|null} [failedcause] ConferenceMember failedcause
         */
    
        /**
         * Constructs a new ConferenceMember.
         * @exports ConferenceMember
         * @classdesc Represents a ConferenceMember.
         * @implements IConferenceMember
         * @constructor
         * @param {IConferenceMember=} [properties] Properties to set
         */
        function ConferenceMember(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * ConferenceMember payload.
         * @member {ConferenceMember.Payload} payload
         * @memberof ConferenceMember
         * @instance
         */
        ConferenceMember.prototype.payload = 0;
    
        /**
         * ConferenceMember lref.
         * @member {number} lref
         * @memberof ConferenceMember
         * @instance
         */
        ConferenceMember.prototype.lref = 0;
    
        /**
         * ConferenceMember state.
         * @member {ConferenceMember.State} state
         * @memberof ConferenceMember
         * @instance
         */
        ConferenceMember.prototype.state = 0;
    
        /**
         * ConferenceMember direction.
         * @member {ConferenceMember.Direction} direction
         * @memberof ConferenceMember
         * @instance
         */
        ConferenceMember.prototype.direction = 0;
    
        /**
         * ConferenceMember activeheld.
         * @member {boolean} activeheld
         * @memberof ConferenceMember
         * @instance
         */
        ConferenceMember.prototype.activeheld = false;
    
        /**
         * ConferenceMember calledparty.
         * @member {string} calledparty
         * @memberof ConferenceMember
         * @instance
         */
        ConferenceMember.prototype.calledparty = "";
    
        /**
         * ConferenceMember connectedparty.
         * @member {IPartyInfo|null|undefined} connectedparty
         * @memberof ConferenceMember
         * @instance
         */
        ConferenceMember.prototype.connectedparty = null;
    
        /**
         * ConferenceMember mute.
         * @member {boolean} mute
         * @memberof ConferenceMember
         * @instance
         */
        ConferenceMember.prototype.mute = false;
    
        /**
         * ConferenceMember failedcause.
         * @member {ConferenceMember.FailedCause} failedcause
         * @memberof ConferenceMember
         * @instance
         */
        ConferenceMember.prototype.failedcause = 0;
    
        /**
         * Creates a new ConferenceMember instance using the specified properties.
         * @function create
         * @memberof ConferenceMember
         * @static
         * @param {IConferenceMember=} [properties] Properties to set
         * @returns {ConferenceMember} ConferenceMember instance
         */
        ConferenceMember.create = function create(properties) {
            return new ConferenceMember(properties);
        };
    
        /**
         * Encodes the specified ConferenceMember message. Does not implicitly {@link ConferenceMember.verify|verify} messages.
         * @function encode
         * @memberof ConferenceMember
         * @static
         * @param {IConferenceMember} message ConferenceMember message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ConferenceMember.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.payload != null && message.hasOwnProperty("payload"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.payload);
            if (message.lref != null && message.hasOwnProperty("lref"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.lref);
            if (message.state != null && message.hasOwnProperty("state"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.state);
            if (message.direction != null && message.hasOwnProperty("direction"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.direction);
            if (message.activeheld != null && message.hasOwnProperty("activeheld"))
                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.activeheld);
            if (message.calledparty != null && message.hasOwnProperty("calledparty"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.calledparty);
            if (message.connectedparty != null && message.hasOwnProperty("connectedparty"))
                $root.PartyInfo.encode(message.connectedparty, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.mute != null && message.hasOwnProperty("mute"))
                writer.uint32(/* id 16, wireType 0 =*/128).bool(message.mute);
            if (message.failedcause != null && message.hasOwnProperty("failedcause"))
                writer.uint32(/* id 17, wireType 0 =*/136).int32(message.failedcause);
            return writer;
        };
    
        /**
         * Encodes the specified ConferenceMember message, length delimited. Does not implicitly {@link ConferenceMember.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ConferenceMember
         * @static
         * @param {IConferenceMember} message ConferenceMember message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ConferenceMember.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a ConferenceMember message from the specified reader or buffer.
         * @function decode
         * @memberof ConferenceMember
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ConferenceMember} ConferenceMember
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ConferenceMember.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ConferenceMember();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.payload = reader.int32();
                    break;
                case 2:
                    message.lref = reader.int32();
                    break;
                case 5:
                    message.state = reader.int32();
                    break;
                case 6:
                    message.direction = reader.int32();
                    break;
                case 7:
                    message.activeheld = reader.bool();
                    break;
                case 10:
                    message.calledparty = reader.string();
                    break;
                case 12:
                    message.connectedparty = $root.PartyInfo.decode(reader, reader.uint32());
                    break;
                case 16:
                    message.mute = reader.bool();
                    break;
                case 17:
                    message.failedcause = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a ConferenceMember message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ConferenceMember
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ConferenceMember} ConferenceMember
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ConferenceMember.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a ConferenceMember message.
         * @function verify
         * @memberof ConferenceMember
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ConferenceMember.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.payload != null && message.hasOwnProperty("payload"))
                switch (message.payload) {
                default:
                    return "payload: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.lref != null && message.hasOwnProperty("lref"))
                if (!$util.isInteger(message.lref))
                    return "lref: integer expected";
            if (message.state != null && message.hasOwnProperty("state"))
                switch (message.state) {
                default:
                    return "state: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                    break;
                }
            if (message.direction != null && message.hasOwnProperty("direction"))
                switch (message.direction) {
                default:
                    return "direction: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.activeheld != null && message.hasOwnProperty("activeheld"))
                if (typeof message.activeheld !== "boolean")
                    return "activeheld: boolean expected";
            if (message.calledparty != null && message.hasOwnProperty("calledparty"))
                if (!$util.isString(message.calledparty))
                    return "calledparty: string expected";
            if (message.connectedparty != null && message.hasOwnProperty("connectedparty")) {
                var error = $root.PartyInfo.verify(message.connectedparty);
                if (error)
                    return "connectedparty." + error;
            }
            if (message.mute != null && message.hasOwnProperty("mute"))
                if (typeof message.mute !== "boolean")
                    return "mute: boolean expected";
            if (message.failedcause != null && message.hasOwnProperty("failedcause"))
                switch (message.failedcause) {
                default:
                    return "failedcause: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                    break;
                }
            return null;
        };
    
        /**
         * Creates a ConferenceMember message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ConferenceMember
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ConferenceMember} ConferenceMember
         */
        ConferenceMember.fromObject = function fromObject(object) {
            if (object instanceof $root.ConferenceMember)
                return object;
            var message = new $root.ConferenceMember();
            switch (object.payload) {
            case "FULL":
            case 0:
                message.payload = 0;
                break;
            case "CHANGES":
            case 1:
                message.payload = 1;
                break;
            }
            if (object.lref != null)
                message.lref = object.lref | 0;
            switch (object.state) {
            case "UNKNOWN":
            case 0:
                message.state = 0;
                break;
            case "DIALTONE":
            case 1:
                message.state = 1;
                break;
            case "DIALLING":
            case 2:
                message.state = 2;
                break;
            case "DIALLED":
            case 3:
                message.state = 3;
                break;
            case "RINGING":
            case 4:
                message.state = 4;
                break;
            case "RINGBACK":
            case 5:
                message.state = 5;
                break;
            case "CONNECTED":
            case 6:
                message.state = 6;
                break;
            case "ONHOLD":
            case 7:
                message.state = 7;
                break;
            case "ONHOLDPENDTRANSFER":
            case 8:
                message.state = 8;
                break;
            case "ONHOLDPENDCONF":
            case 9:
                message.state = 9;
                break;
            case "DISCONNECTED":
            case 10:
                message.state = 10;
                break;
            case "BUSY":
            case 11:
                message.state = 11;
                break;
            case "FAILED":
            case 12:
                message.state = 12;
                break;
            case "WAITINGFORACCT":
            case 13:
                message.state = 13;
                break;
            case "WAITINGFORAUTH":
            case 14:
                message.state = 14;
                break;
            case "WAITINGFORLINE":
            case 15:
                message.state = 15;
                break;
            }
            switch (object.direction) {
            case "UNDEFINED":
            case 0:
                message.direction = 0;
                break;
            case "OUTBOUND":
            case 1:
                message.direction = 1;
                break;
            case "INBOUND":
            case 2:
                message.direction = 2;
                break;
            case "PICKUP":
            case 3:
                message.direction = 3;
                break;
            }
            if (object.activeheld != null)
                message.activeheld = Boolean(object.activeheld);
            if (object.calledparty != null)
                message.calledparty = String(object.calledparty);
            if (object.connectedparty != null) {
                if (typeof object.connectedparty !== "object")
                    throw TypeError(".ConferenceMember.connectedparty: object expected");
                message.connectedparty = $root.PartyInfo.fromObject(object.connectedparty);
            }
            if (object.mute != null)
                message.mute = Boolean(object.mute);
            switch (object.failedcause) {
            case "UNSET":
            case 0:
                message.failedcause = 0;
                break;
            case "UNSPECIFIED":
            case 1:
                message.failedcause = 1;
                break;
            case "UNALLOCATEDNUMBER":
            case 2:
                message.failedcause = 2;
                break;
            case "REJECTED":
            case 3:
                message.failedcause = 3;
                break;
            case "NUMBEROOO":
            case 4:
                message.failedcause = 4;
                break;
            case "NETWORKOOO":
            case 5:
                message.failedcause = 5;
                break;
            case "BARRED":
            case 6:
                message.failedcause = 6;
                break;
            case "NOCHANNEL":
            case 7:
                message.failedcause = 7;
                break;
            case "NOACCOUNTCODE":
            case 8:
                message.failedcause = 8;
                break;
            case "NOAUTHCODE":
            case 9:
                message.failedcause = 9;
                break;
            case "NOLICENCE":
            case 10:
                message.failedcause = 10;
                break;
            case "LOCALRESOURCES":
            case 11:
                message.failedcause = 11;
                break;
            case "BANDWIDTH":
            case 12:
                message.failedcause = 12;
                break;
            case "COMPATIBILITY":
            case 13:
                message.failedcause = 13;
                break;
            case "CANTRECORD":
            case 14:
                message.failedcause = 14;
                break;
            }
            return message;
        };
    
        /**
         * Creates a plain object from a ConferenceMember message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ConferenceMember
         * @static
         * @param {ConferenceMember} message ConferenceMember
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ConferenceMember.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.payload = options.enums === String ? "FULL" : 0;
                object.lref = 0;
                object.state = options.enums === String ? "UNKNOWN" : 0;
                object.direction = options.enums === String ? "UNDEFINED" : 0;
                object.activeheld = false;
                object.calledparty = "";
                object.connectedparty = null;
                object.mute = false;
                object.failedcause = options.enums === String ? "UNSET" : 0;
            }
            if (message.payload != null && message.hasOwnProperty("payload"))
                object.payload = options.enums === String ? $root.ConferenceMember.Payload[message.payload] : message.payload;
            if (message.lref != null && message.hasOwnProperty("lref"))
                object.lref = message.lref;
            if (message.state != null && message.hasOwnProperty("state"))
                object.state = options.enums === String ? $root.ConferenceMember.State[message.state] : message.state;
            if (message.direction != null && message.hasOwnProperty("direction"))
                object.direction = options.enums === String ? $root.ConferenceMember.Direction[message.direction] : message.direction;
            if (message.activeheld != null && message.hasOwnProperty("activeheld"))
                object.activeheld = message.activeheld;
            if (message.calledparty != null && message.hasOwnProperty("calledparty"))
                object.calledparty = message.calledparty;
            if (message.connectedparty != null && message.hasOwnProperty("connectedparty"))
                object.connectedparty = $root.PartyInfo.toObject(message.connectedparty, options);
            if (message.mute != null && message.hasOwnProperty("mute"))
                object.mute = message.mute;
            if (message.failedcause != null && message.hasOwnProperty("failedcause"))
                object.failedcause = options.enums === String ? $root.ConferenceMember.FailedCause[message.failedcause] : message.failedcause;
            return object;
        };
    
        /**
         * Converts this ConferenceMember to JSON.
         * @function toJSON
         * @memberof ConferenceMember
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ConferenceMember.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Payload enum.
         * @name ConferenceMember.Payload
         * @enum {string}
         * @property {number} FULL=0 FULL value
         * @property {number} CHANGES=1 CHANGES value
         */
        ConferenceMember.Payload = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "FULL"] = 0;
            values[valuesById[1] = "CHANGES"] = 1;
            return values;
        })();
    
        /**
         * State enum.
         * @name ConferenceMember.State
         * @enum {string}
         * @property {number} UNKNOWN=0 UNKNOWN value
         * @property {number} DIALTONE=1 DIALTONE value
         * @property {number} DIALLING=2 DIALLING value
         * @property {number} DIALLED=3 DIALLED value
         * @property {number} RINGING=4 RINGING value
         * @property {number} RINGBACK=5 RINGBACK value
         * @property {number} CONNECTED=6 CONNECTED value
         * @property {number} ONHOLD=7 ONHOLD value
         * @property {number} ONHOLDPENDTRANSFER=8 ONHOLDPENDTRANSFER value
         * @property {number} ONHOLDPENDCONF=9 ONHOLDPENDCONF value
         * @property {number} DISCONNECTED=10 DISCONNECTED value
         * @property {number} BUSY=11 BUSY value
         * @property {number} FAILED=12 FAILED value
         * @property {number} WAITINGFORACCT=13 WAITINGFORACCT value
         * @property {number} WAITINGFORAUTH=14 WAITINGFORAUTH value
         * @property {number} WAITINGFORLINE=15 WAITINGFORLINE value
         */
        ConferenceMember.State = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNKNOWN"] = 0;
            values[valuesById[1] = "DIALTONE"] = 1;
            values[valuesById[2] = "DIALLING"] = 2;
            values[valuesById[3] = "DIALLED"] = 3;
            values[valuesById[4] = "RINGING"] = 4;
            values[valuesById[5] = "RINGBACK"] = 5;
            values[valuesById[6] = "CONNECTED"] = 6;
            values[valuesById[7] = "ONHOLD"] = 7;
            values[valuesById[8] = "ONHOLDPENDTRANSFER"] = 8;
            values[valuesById[9] = "ONHOLDPENDCONF"] = 9;
            values[valuesById[10] = "DISCONNECTED"] = 10;
            values[valuesById[11] = "BUSY"] = 11;
            values[valuesById[12] = "FAILED"] = 12;
            values[valuesById[13] = "WAITINGFORACCT"] = 13;
            values[valuesById[14] = "WAITINGFORAUTH"] = 14;
            values[valuesById[15] = "WAITINGFORLINE"] = 15;
            return values;
        })();
    
        /**
         * Direction enum.
         * @name ConferenceMember.Direction
         * @enum {string}
         * @property {number} UNDEFINED=0 UNDEFINED value
         * @property {number} OUTBOUND=1 OUTBOUND value
         * @property {number} INBOUND=2 INBOUND value
         * @property {number} PICKUP=3 PICKUP value
         */
        ConferenceMember.Direction = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNDEFINED"] = 0;
            values[valuesById[1] = "OUTBOUND"] = 1;
            values[valuesById[2] = "INBOUND"] = 2;
            values[valuesById[3] = "PICKUP"] = 3;
            return values;
        })();
    
        /**
         * FailedCause enum.
         * @name ConferenceMember.FailedCause
         * @enum {string}
         * @property {number} UNSET=0 UNSET value
         * @property {number} UNSPECIFIED=1 UNSPECIFIED value
         * @property {number} UNALLOCATEDNUMBER=2 UNALLOCATEDNUMBER value
         * @property {number} REJECTED=3 REJECTED value
         * @property {number} NUMBEROOO=4 NUMBEROOO value
         * @property {number} NETWORKOOO=5 NETWORKOOO value
         * @property {number} BARRED=6 BARRED value
         * @property {number} NOCHANNEL=7 NOCHANNEL value
         * @property {number} NOACCOUNTCODE=8 NOACCOUNTCODE value
         * @property {number} NOAUTHCODE=9 NOAUTHCODE value
         * @property {number} NOLICENCE=10 NOLICENCE value
         * @property {number} LOCALRESOURCES=11 LOCALRESOURCES value
         * @property {number} BANDWIDTH=12 BANDWIDTH value
         * @property {number} COMPATIBILITY=13 COMPATIBILITY value
         * @property {number} CANTRECORD=14 CANTRECORD value
         */
        ConferenceMember.FailedCause = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNSET"] = 0;
            values[valuesById[1] = "UNSPECIFIED"] = 1;
            values[valuesById[2] = "UNALLOCATEDNUMBER"] = 2;
            values[valuesById[3] = "REJECTED"] = 3;
            values[valuesById[4] = "NUMBEROOO"] = 4;
            values[valuesById[5] = "NETWORKOOO"] = 5;
            values[valuesById[6] = "BARRED"] = 6;
            values[valuesById[7] = "NOCHANNEL"] = 7;
            values[valuesById[8] = "NOACCOUNTCODE"] = 8;
            values[valuesById[9] = "NOAUTHCODE"] = 9;
            values[valuesById[10] = "NOLICENCE"] = 10;
            values[valuesById[11] = "LOCALRESOURCES"] = 11;
            values[valuesById[12] = "BANDWIDTH"] = 12;
            values[valuesById[13] = "COMPATIBILITY"] = 13;
            values[valuesById[14] = "CANTRECORD"] = 14;
            return values;
        })();
    
        return ConferenceMember;
    })();
    
    $root.CallInfo = (function() {
    
        /**
         * Properties of a CallInfo.
         * @exports ICallInfo
         * @interface ICallInfo
         * @property {CallInfo.Payload|null} [payload] CallInfo payload
         * @property {number|null} [callid] CallInfo callid
         * @property {number|null} [referencecallid] CallInfo referencecallid
         * @property {number|null} [relatedcallid] CallInfo relatedcallid
         * @property {CallInfo.State|null} [state] CallInfo state
         * @property {CallInfo.Direction|null} [direction] CallInfo direction
         * @property {boolean|null} [activeheld] CallInfo activeheld
         * @property {Uint8Array|null} [gcid] CallInfo gcid
         * @property {number|null} [featuresavailable] CallInfo featuresavailable
         * @property {string|null} [calledparty] CallInfo calledparty
         * @property {IPartyInfo|null} [callingparty] CallInfo callingparty
         * @property {IPartyInfo|null} [connectedparty] CallInfo connectedparty
         * @property {IPartyInfo|null} [originalcalledparty] CallInfo originalcalledparty
         * @property {string|null} [tag] CallInfo tag
         * @property {string|null} [accountcode] CallInfo accountcode
         * @property {boolean|null} [mute] CallInfo mute
         * @property {CallInfo.FailedCause|null} [failedcause] CallInfo failedcause
         * @property {number|null} [featuresavailable2] CallInfo featuresavailable2
         * @property {boolean|null} [recording] CallInfo recording
         * @property {Array.<IConferenceMember>|null} [conferencemember] CallInfo conferencemember
         * @property {IDialInfo|null} [dialinfo] CallInfo dialinfo
         * @property {ICallData|null} [calldata] CallInfo calldata
         * @property {string|null} [sdp] CallInfo sdp
         */
    
        /**
         * Constructs a new CallInfo.
         * @exports CallInfo
         * @classdesc Represents a CallInfo.
         * @implements ICallInfo
         * @constructor
         * @param {ICallInfo=} [properties] Properties to set
         */
        function CallInfo(properties) {
            this.conferencemember = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * CallInfo payload.
         * @member {CallInfo.Payload} payload
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.payload = 0;
    
        /**
         * CallInfo callid.
         * @member {number} callid
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.callid = 0;
    
        /**
         * CallInfo referencecallid.
         * @member {number} referencecallid
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.referencecallid = 0;
    
        /**
         * CallInfo relatedcallid.
         * @member {number} relatedcallid
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.relatedcallid = 0;
    
        /**
         * CallInfo state.
         * @member {CallInfo.State} state
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.state = 0;
    
        /**
         * CallInfo direction.
         * @member {CallInfo.Direction} direction
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.direction = 0;
    
        /**
         * CallInfo activeheld.
         * @member {boolean} activeheld
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.activeheld = false;
    
        /**
         * CallInfo gcid.
         * @member {Uint8Array} gcid
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.gcid = $util.newBuffer([]);
    
        /**
         * CallInfo featuresavailable.
         * @member {number} featuresavailable
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.featuresavailable = 0;
    
        /**
         * CallInfo calledparty.
         * @member {string} calledparty
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.calledparty = "";
    
        /**
         * CallInfo callingparty.
         * @member {IPartyInfo|null|undefined} callingparty
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.callingparty = null;
    
        /**
         * CallInfo connectedparty.
         * @member {IPartyInfo|null|undefined} connectedparty
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.connectedparty = null;
    
        /**
         * CallInfo originalcalledparty.
         * @member {IPartyInfo|null|undefined} originalcalledparty
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.originalcalledparty = null;
    
        /**
         * CallInfo tag.
         * @member {string} tag
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.tag = "";
    
        /**
         * CallInfo accountcode.
         * @member {string} accountcode
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.accountcode = "";
    
        /**
         * CallInfo mute.
         * @member {boolean} mute
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.mute = false;
    
        /**
         * CallInfo failedcause.
         * @member {CallInfo.FailedCause} failedcause
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.failedcause = 0;
    
        /**
         * CallInfo featuresavailable2.
         * @member {number} featuresavailable2
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.featuresavailable2 = 0;
    
        /**
         * CallInfo recording.
         * @member {boolean} recording
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.recording = false;
    
        /**
         * CallInfo conferencemember.
         * @member {Array.<IConferenceMember>} conferencemember
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.conferencemember = $util.emptyArray;
    
        /**
         * CallInfo dialinfo.
         * @member {IDialInfo|null|undefined} dialinfo
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.dialinfo = null;
    
        /**
         * CallInfo calldata.
         * @member {ICallData|null|undefined} calldata
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.calldata = null;
    
        /**
         * CallInfo sdp.
         * @member {string} sdp
         * @memberof CallInfo
         * @instance
         */
        CallInfo.prototype.sdp = "";
    
        /**
         * Creates a new CallInfo instance using the specified properties.
         * @function create
         * @memberof CallInfo
         * @static
         * @param {ICallInfo=} [properties] Properties to set
         * @returns {CallInfo} CallInfo instance
         */
        CallInfo.create = function create(properties) {
            return new CallInfo(properties);
        };
    
        /**
         * Encodes the specified CallInfo message. Does not implicitly {@link CallInfo.verify|verify} messages.
         * @function encode
         * @memberof CallInfo
         * @static
         * @param {ICallInfo} message CallInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CallInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.payload != null && message.hasOwnProperty("payload"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.payload);
            if (message.callid != null && message.hasOwnProperty("callid"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.callid);
            if (message.referencecallid != null && message.hasOwnProperty("referencecallid"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.referencecallid);
            if (message.relatedcallid != null && message.hasOwnProperty("relatedcallid"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.relatedcallid);
            if (message.state != null && message.hasOwnProperty("state"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.state);
            if (message.direction != null && message.hasOwnProperty("direction"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.direction);
            if (message.activeheld != null && message.hasOwnProperty("activeheld"))
                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.activeheld);
            if (message.gcid != null && message.hasOwnProperty("gcid"))
                writer.uint32(/* id 8, wireType 2 =*/66).bytes(message.gcid);
            if (message.featuresavailable != null && message.hasOwnProperty("featuresavailable"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.featuresavailable);
            if (message.calledparty != null && message.hasOwnProperty("calledparty"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.calledparty);
            if (message.callingparty != null && message.hasOwnProperty("callingparty"))
                $root.PartyInfo.encode(message.callingparty, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.connectedparty != null && message.hasOwnProperty("connectedparty"))
                $root.PartyInfo.encode(message.connectedparty, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.originalcalledparty != null && message.hasOwnProperty("originalcalledparty"))
                $root.PartyInfo.encode(message.originalcalledparty, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
            if (message.tag != null && message.hasOwnProperty("tag"))
                writer.uint32(/* id 14, wireType 2 =*/114).string(message.tag);
            if (message.accountcode != null && message.hasOwnProperty("accountcode"))
                writer.uint32(/* id 15, wireType 2 =*/122).string(message.accountcode);
            if (message.mute != null && message.hasOwnProperty("mute"))
                writer.uint32(/* id 16, wireType 0 =*/128).bool(message.mute);
            if (message.failedcause != null && message.hasOwnProperty("failedcause"))
                writer.uint32(/* id 17, wireType 0 =*/136).int32(message.failedcause);
            if (message.featuresavailable2 != null && message.hasOwnProperty("featuresavailable2"))
                writer.uint32(/* id 18, wireType 0 =*/144).int32(message.featuresavailable2);
            if (message.recording != null && message.hasOwnProperty("recording"))
                writer.uint32(/* id 19, wireType 0 =*/152).bool(message.recording);
            if (message.conferencemember != null && message.conferencemember.length)
                for (var i = 0; i < message.conferencemember.length; ++i)
                    $root.ConferenceMember.encode(message.conferencemember[i], writer.uint32(/* id 52, wireType 2 =*/418).fork()).ldelim();
            if (message.dialinfo != null && message.hasOwnProperty("dialinfo"))
                $root.DialInfo.encode(message.dialinfo, writer.uint32(/* id 53, wireType 2 =*/426).fork()).ldelim();
            if (message.calldata != null && message.hasOwnProperty("calldata"))
                $root.CallData.encode(message.calldata, writer.uint32(/* id 56, wireType 2 =*/450).fork()).ldelim();
            if (message.sdp != null && message.hasOwnProperty("sdp"))
                writer.uint32(/* id 100, wireType 2 =*/802).string(message.sdp);
            return writer;
        };
    
        /**
         * Encodes the specified CallInfo message, length delimited. Does not implicitly {@link CallInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof CallInfo
         * @static
         * @param {ICallInfo} message CallInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CallInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a CallInfo message from the specified reader or buffer.
         * @function decode
         * @memberof CallInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {CallInfo} CallInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CallInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CallInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.payload = reader.int32();
                    break;
                case 2:
                    message.callid = reader.int32();
                    break;
                case 3:
                    message.referencecallid = reader.int32();
                    break;
                case 4:
                    message.relatedcallid = reader.int32();
                    break;
                case 5:
                    message.state = reader.int32();
                    break;
                case 6:
                    message.direction = reader.int32();
                    break;
                case 7:
                    message.activeheld = reader.bool();
                    break;
                case 8:
                    message.gcid = reader.bytes();
                    break;
                case 9:
                    message.featuresavailable = reader.int32();
                    break;
                case 10:
                    message.calledparty = reader.string();
                    break;
                case 11:
                    message.callingparty = $root.PartyInfo.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.connectedparty = $root.PartyInfo.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.originalcalledparty = $root.PartyInfo.decode(reader, reader.uint32());
                    break;
                case 14:
                    message.tag = reader.string();
                    break;
                case 15:
                    message.accountcode = reader.string();
                    break;
                case 16:
                    message.mute = reader.bool();
                    break;
                case 17:
                    message.failedcause = reader.int32();
                    break;
                case 18:
                    message.featuresavailable2 = reader.int32();
                    break;
                case 19:
                    message.recording = reader.bool();
                    break;
                case 52:
                    if (!(message.conferencemember && message.conferencemember.length))
                        message.conferencemember = [];
                    message.conferencemember.push($root.ConferenceMember.decode(reader, reader.uint32()));
                    break;
                case 53:
                    message.dialinfo = $root.DialInfo.decode(reader, reader.uint32());
                    break;
                case 56:
                    message.calldata = $root.CallData.decode(reader, reader.uint32());
                    break;
                case 100:
                    message.sdp = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a CallInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof CallInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {CallInfo} CallInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CallInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a CallInfo message.
         * @function verify
         * @memberof CallInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CallInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.payload != null && message.hasOwnProperty("payload"))
                switch (message.payload) {
                default:
                    return "payload: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.callid != null && message.hasOwnProperty("callid"))
                if (!$util.isInteger(message.callid))
                    return "callid: integer expected";
            if (message.referencecallid != null && message.hasOwnProperty("referencecallid"))
                if (!$util.isInteger(message.referencecallid))
                    return "referencecallid: integer expected";
            if (message.relatedcallid != null && message.hasOwnProperty("relatedcallid"))
                if (!$util.isInteger(message.relatedcallid))
                    return "relatedcallid: integer expected";
            if (message.state != null && message.hasOwnProperty("state"))
                switch (message.state) {
                default:
                    return "state: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                    break;
                }
            if (message.direction != null && message.hasOwnProperty("direction"))
                switch (message.direction) {
                default:
                    return "direction: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.activeheld != null && message.hasOwnProperty("activeheld"))
                if (typeof message.activeheld !== "boolean")
                    return "activeheld: boolean expected";
            if (message.gcid != null && message.hasOwnProperty("gcid"))
                if (!(message.gcid && typeof message.gcid.length === "number" || $util.isString(message.gcid)))
                    return "gcid: buffer expected";
            if (message.featuresavailable != null && message.hasOwnProperty("featuresavailable"))
                if (!$util.isInteger(message.featuresavailable))
                    return "featuresavailable: integer expected";
            if (message.calledparty != null && message.hasOwnProperty("calledparty"))
                if (!$util.isString(message.calledparty))
                    return "calledparty: string expected";
            if (message.callingparty != null && message.hasOwnProperty("callingparty")) {
                var error = $root.PartyInfo.verify(message.callingparty);
                if (error)
                    return "callingparty." + error;
            }
            if (message.connectedparty != null && message.hasOwnProperty("connectedparty")) {
                var error = $root.PartyInfo.verify(message.connectedparty);
                if (error)
                    return "connectedparty." + error;
            }
            if (message.originalcalledparty != null && message.hasOwnProperty("originalcalledparty")) {
                var error = $root.PartyInfo.verify(message.originalcalledparty);
                if (error)
                    return "originalcalledparty." + error;
            }
            if (message.tag != null && message.hasOwnProperty("tag"))
                if (!$util.isString(message.tag))
                    return "tag: string expected";
            if (message.accountcode != null && message.hasOwnProperty("accountcode"))
                if (!$util.isString(message.accountcode))
                    return "accountcode: string expected";
            if (message.mute != null && message.hasOwnProperty("mute"))
                if (typeof message.mute !== "boolean")
                    return "mute: boolean expected";
            if (message.failedcause != null && message.hasOwnProperty("failedcause"))
                switch (message.failedcause) {
                default:
                    return "failedcause: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                    break;
                }
            if (message.featuresavailable2 != null && message.hasOwnProperty("featuresavailable2"))
                if (!$util.isInteger(message.featuresavailable2))
                    return "featuresavailable2: integer expected";
            if (message.recording != null && message.hasOwnProperty("recording"))
                if (typeof message.recording !== "boolean")
                    return "recording: boolean expected";
            if (message.conferencemember != null && message.hasOwnProperty("conferencemember")) {
                if (!Array.isArray(message.conferencemember))
                    return "conferencemember: array expected";
                for (var i = 0; i < message.conferencemember.length; ++i) {
                    var error = $root.ConferenceMember.verify(message.conferencemember[i]);
                    if (error)
                        return "conferencemember." + error;
                }
            }
            if (message.dialinfo != null && message.hasOwnProperty("dialinfo")) {
                var error = $root.DialInfo.verify(message.dialinfo);
                if (error)
                    return "dialinfo." + error;
            }
            if (message.calldata != null && message.hasOwnProperty("calldata")) {
                var error = $root.CallData.verify(message.calldata);
                if (error)
                    return "calldata." + error;
            }
            if (message.sdp != null && message.hasOwnProperty("sdp"))
                if (!$util.isString(message.sdp))
                    return "sdp: string expected";
            return null;
        };
    
        /**
         * Creates a CallInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof CallInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {CallInfo} CallInfo
         */
        CallInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.CallInfo)
                return object;
            var message = new $root.CallInfo();
            switch (object.payload) {
            case "FULL":
            case 0:
                message.payload = 0;
                break;
            case "CHANGES":
            case 1:
                message.payload = 1;
                break;
            }
            if (object.callid != null)
                message.callid = object.callid | 0;
            if (object.referencecallid != null)
                message.referencecallid = object.referencecallid | 0;
            if (object.relatedcallid != null)
                message.relatedcallid = object.relatedcallid | 0;
            switch (object.state) {
            case "UNKNOWN":
            case 0:
                message.state = 0;
                break;
            case "DIALTONE":
            case 1:
                message.state = 1;
                break;
            case "DIALLING":
            case 2:
                message.state = 2;
                break;
            case "DIALLED":
            case 3:
                message.state = 3;
                break;
            case "RINGING":
            case 4:
                message.state = 4;
                break;
            case "RINGBACK":
            case 5:
                message.state = 5;
                break;
            case "CONNECTED":
            case 6:
                message.state = 6;
                break;
            case "ONHOLD":
            case 7:
                message.state = 7;
                break;
            case "ONHOLDPENDTRANSFER":
            case 8:
                message.state = 8;
                break;
            case "ONHOLDPENDCONF":
            case 9:
                message.state = 9;
                break;
            case "DISCONNECTED":
            case 10:
                message.state = 10;
                break;
            case "BUSY":
            case 11:
                message.state = 11;
                break;
            case "FAILED":
            case 12:
                message.state = 12;
                break;
            case "WAITINGFORACCT":
            case 13:
                message.state = 13;
                break;
            case "WAITINGFORAUTH":
            case 14:
                message.state = 14;
                break;
            case "WAITINGFORLINE":
            case 15:
                message.state = 15;
                break;
            }
            switch (object.direction) {
            case "UNDEFINED":
            case 0:
                message.direction = 0;
                break;
            case "OUTBOUND":
            case 1:
                message.direction = 1;
                break;
            case "INBOUND":
            case 2:
                message.direction = 2;
                break;
            case "PICKUP":
            case 3:
                message.direction = 3;
                break;
            }
            if (object.activeheld != null)
                message.activeheld = Boolean(object.activeheld);
            if (object.gcid != null)
                if (typeof object.gcid === "string")
                    $util.base64.decode(object.gcid, message.gcid = $util.newBuffer($util.base64.length(object.gcid)), 0);
                else if (object.gcid.length)
                    message.gcid = object.gcid;
            if (object.featuresavailable != null)
                message.featuresavailable = object.featuresavailable | 0;
            if (object.calledparty != null)
                message.calledparty = String(object.calledparty);
            if (object.callingparty != null) {
                if (typeof object.callingparty !== "object")
                    throw TypeError(".CallInfo.callingparty: object expected");
                message.callingparty = $root.PartyInfo.fromObject(object.callingparty);
            }
            if (object.connectedparty != null) {
                if (typeof object.connectedparty !== "object")
                    throw TypeError(".CallInfo.connectedparty: object expected");
                message.connectedparty = $root.PartyInfo.fromObject(object.connectedparty);
            }
            if (object.originalcalledparty != null) {
                if (typeof object.originalcalledparty !== "object")
                    throw TypeError(".CallInfo.originalcalledparty: object expected");
                message.originalcalledparty = $root.PartyInfo.fromObject(object.originalcalledparty);
            }
            if (object.tag != null)
                message.tag = String(object.tag);
            if (object.accountcode != null)
                message.accountcode = String(object.accountcode);
            if (object.mute != null)
                message.mute = Boolean(object.mute);
            switch (object.failedcause) {
            case "UNSET":
            case 0:
                message.failedcause = 0;
                break;
            case "UNSPECIFIED":
            case 1:
                message.failedcause = 1;
                break;
            case "UNALLOCATEDNUMBER":
            case 2:
                message.failedcause = 2;
                break;
            case "REJECTED":
            case 3:
                message.failedcause = 3;
                break;
            case "NUMBEROOO":
            case 4:
                message.failedcause = 4;
                break;
            case "NETWORKOOO":
            case 5:
                message.failedcause = 5;
                break;
            case "BARRED":
            case 6:
                message.failedcause = 6;
                break;
            case "NOCHANNEL":
            case 7:
                message.failedcause = 7;
                break;
            case "NOACCOUNTCODE":
            case 8:
                message.failedcause = 8;
                break;
            case "NOAUTHCODE":
            case 9:
                message.failedcause = 9;
                break;
            case "NOLICENCE":
            case 10:
                message.failedcause = 10;
                break;
            case "LOCALRESOURCES":
            case 11:
                message.failedcause = 11;
                break;
            case "BANDWIDTH":
            case 12:
                message.failedcause = 12;
                break;
            case "COMPATIBILITY":
            case 13:
                message.failedcause = 13;
                break;
            case "CANTRECORD":
            case 14:
                message.failedcause = 14;
                break;
            }
            if (object.featuresavailable2 != null)
                message.featuresavailable2 = object.featuresavailable2 | 0;
            if (object.recording != null)
                message.recording = Boolean(object.recording);
            if (object.conferencemember) {
                if (!Array.isArray(object.conferencemember))
                    throw TypeError(".CallInfo.conferencemember: array expected");
                message.conferencemember = [];
                for (var i = 0; i < object.conferencemember.length; ++i) {
                    if (typeof object.conferencemember[i] !== "object")
                        throw TypeError(".CallInfo.conferencemember: object expected");
                    message.conferencemember[i] = $root.ConferenceMember.fromObject(object.conferencemember[i]);
                }
            }
            if (object.dialinfo != null) {
                if (typeof object.dialinfo !== "object")
                    throw TypeError(".CallInfo.dialinfo: object expected");
                message.dialinfo = $root.DialInfo.fromObject(object.dialinfo);
            }
            if (object.calldata != null) {
                if (typeof object.calldata !== "object")
                    throw TypeError(".CallInfo.calldata: object expected");
                message.calldata = $root.CallData.fromObject(object.calldata);
            }
            if (object.sdp != null)
                message.sdp = String(object.sdp);
            return message;
        };
    
        /**
         * Creates a plain object from a CallInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof CallInfo
         * @static
         * @param {CallInfo} message CallInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CallInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.conferencemember = [];
            if (options.defaults) {
                object.payload = options.enums === String ? "FULL" : 0;
                object.callid = 0;
                object.referencecallid = 0;
                object.relatedcallid = 0;
                object.state = options.enums === String ? "UNKNOWN" : 0;
                object.direction = options.enums === String ? "UNDEFINED" : 0;
                object.activeheld = false;
                object.gcid = options.bytes === String ? "" : [];
                object.featuresavailable = 0;
                object.calledparty = "";
                object.callingparty = null;
                object.connectedparty = null;
                object.originalcalledparty = null;
                object.tag = "";
                object.accountcode = "";
                object.mute = false;
                object.failedcause = options.enums === String ? "UNSET" : 0;
                object.featuresavailable2 = 0;
                object.recording = false;
                object.dialinfo = null;
                object.calldata = null;
                object.sdp = "";
            }
            if (message.payload != null && message.hasOwnProperty("payload"))
                object.payload = options.enums === String ? $root.CallInfo.Payload[message.payload] : message.payload;
            if (message.callid != null && message.hasOwnProperty("callid"))
                object.callid = message.callid;
            if (message.referencecallid != null && message.hasOwnProperty("referencecallid"))
                object.referencecallid = message.referencecallid;
            if (message.relatedcallid != null && message.hasOwnProperty("relatedcallid"))
                object.relatedcallid = message.relatedcallid;
            if (message.state != null && message.hasOwnProperty("state"))
                object.state = options.enums === String ? $root.CallInfo.State[message.state] : message.state;
            if (message.direction != null && message.hasOwnProperty("direction"))
                object.direction = options.enums === String ? $root.CallInfo.Direction[message.direction] : message.direction;
            if (message.activeheld != null && message.hasOwnProperty("activeheld"))
                object.activeheld = message.activeheld;
            if (message.gcid != null && message.hasOwnProperty("gcid"))
                object.gcid = options.bytes === String ? $util.base64.encode(message.gcid, 0, message.gcid.length) : options.bytes === Array ? Array.prototype.slice.call(message.gcid) : message.gcid;
            if (message.featuresavailable != null && message.hasOwnProperty("featuresavailable"))
                object.featuresavailable = message.featuresavailable;
            if (message.calledparty != null && message.hasOwnProperty("calledparty"))
                object.calledparty = message.calledparty;
            if (message.callingparty != null && message.hasOwnProperty("callingparty"))
                object.callingparty = $root.PartyInfo.toObject(message.callingparty, options);
            if (message.connectedparty != null && message.hasOwnProperty("connectedparty"))
                object.connectedparty = $root.PartyInfo.toObject(message.connectedparty, options);
            if (message.originalcalledparty != null && message.hasOwnProperty("originalcalledparty"))
                object.originalcalledparty = $root.PartyInfo.toObject(message.originalcalledparty, options);
            if (message.tag != null && message.hasOwnProperty("tag"))
                object.tag = message.tag;
            if (message.accountcode != null && message.hasOwnProperty("accountcode"))
                object.accountcode = message.accountcode;
            if (message.mute != null && message.hasOwnProperty("mute"))
                object.mute = message.mute;
            if (message.failedcause != null && message.hasOwnProperty("failedcause"))
                object.failedcause = options.enums === String ? $root.CallInfo.FailedCause[message.failedcause] : message.failedcause;
            if (message.featuresavailable2 != null && message.hasOwnProperty("featuresavailable2"))
                object.featuresavailable2 = message.featuresavailable2;
            if (message.recording != null && message.hasOwnProperty("recording"))
                object.recording = message.recording;
            if (message.conferencemember && message.conferencemember.length) {
                object.conferencemember = [];
                for (var j = 0; j < message.conferencemember.length; ++j)
                    object.conferencemember[j] = $root.ConferenceMember.toObject(message.conferencemember[j], options);
            }
            if (message.dialinfo != null && message.hasOwnProperty("dialinfo"))
                object.dialinfo = $root.DialInfo.toObject(message.dialinfo, options);
            if (message.calldata != null && message.hasOwnProperty("calldata"))
                object.calldata = $root.CallData.toObject(message.calldata, options);
            if (message.sdp != null && message.hasOwnProperty("sdp"))
                object.sdp = message.sdp;
            return object;
        };
    
        /**
         * Converts this CallInfo to JSON.
         * @function toJSON
         * @memberof CallInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CallInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Payload enum.
         * @name CallInfo.Payload
         * @enum {string}
         * @property {number} FULL=0 FULL value
         * @property {number} CHANGES=1 CHANGES value
         */
        CallInfo.Payload = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "FULL"] = 0;
            values[valuesById[1] = "CHANGES"] = 1;
            return values;
        })();
    
        /**
         * State enum.
         * @name CallInfo.State
         * @enum {string}
         * @property {number} UNKNOWN=0 UNKNOWN value
         * @property {number} DIALTONE=1 DIALTONE value
         * @property {number} DIALLING=2 DIALLING value
         * @property {number} DIALLED=3 DIALLED value
         * @property {number} RINGING=4 RINGING value
         * @property {number} RINGBACK=5 RINGBACK value
         * @property {number} CONNECTED=6 CONNECTED value
         * @property {number} ONHOLD=7 ONHOLD value
         * @property {number} ONHOLDPENDTRANSFER=8 ONHOLDPENDTRANSFER value
         * @property {number} ONHOLDPENDCONF=9 ONHOLDPENDCONF value
         * @property {number} DISCONNECTED=10 DISCONNECTED value
         * @property {number} BUSY=11 BUSY value
         * @property {number} FAILED=12 FAILED value
         * @property {number} WAITINGFORACCT=13 WAITINGFORACCT value
         * @property {number} WAITINGFORAUTH=14 WAITINGFORAUTH value
         * @property {number} WAITINGFORLINE=15 WAITINGFORLINE value
         */
        CallInfo.State = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNKNOWN"] = 0;
            values[valuesById[1] = "DIALTONE"] = 1;
            values[valuesById[2] = "DIALLING"] = 2;
            values[valuesById[3] = "DIALLED"] = 3;
            values[valuesById[4] = "RINGING"] = 4;
            values[valuesById[5] = "RINGBACK"] = 5;
            values[valuesById[6] = "CONNECTED"] = 6;
            values[valuesById[7] = "ONHOLD"] = 7;
            values[valuesById[8] = "ONHOLDPENDTRANSFER"] = 8;
            values[valuesById[9] = "ONHOLDPENDCONF"] = 9;
            values[valuesById[10] = "DISCONNECTED"] = 10;
            values[valuesById[11] = "BUSY"] = 11;
            values[valuesById[12] = "FAILED"] = 12;
            values[valuesById[13] = "WAITINGFORACCT"] = 13;
            values[valuesById[14] = "WAITINGFORAUTH"] = 14;
            values[valuesById[15] = "WAITINGFORLINE"] = 15;
            return values;
        })();
    
        /**
         * Direction enum.
         * @name CallInfo.Direction
         * @enum {string}
         * @property {number} UNDEFINED=0 UNDEFINED value
         * @property {number} OUTBOUND=1 OUTBOUND value
         * @property {number} INBOUND=2 INBOUND value
         * @property {number} PICKUP=3 PICKUP value
         */
        CallInfo.Direction = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNDEFINED"] = 0;
            values[valuesById[1] = "OUTBOUND"] = 1;
            values[valuesById[2] = "INBOUND"] = 2;
            values[valuesById[3] = "PICKUP"] = 3;
            return values;
        })();
    
        /**
         * FailedCause enum.
         * @name CallInfo.FailedCause
         * @enum {string}
         * @property {number} UNSET=0 UNSET value
         * @property {number} UNSPECIFIED=1 UNSPECIFIED value
         * @property {number} UNALLOCATEDNUMBER=2 UNALLOCATEDNUMBER value
         * @property {number} REJECTED=3 REJECTED value
         * @property {number} NUMBEROOO=4 NUMBEROOO value
         * @property {number} NETWORKOOO=5 NETWORKOOO value
         * @property {number} BARRED=6 BARRED value
         * @property {number} NOCHANNEL=7 NOCHANNEL value
         * @property {number} NOACCOUNTCODE=8 NOACCOUNTCODE value
         * @property {number} NOAUTHCODE=9 NOAUTHCODE value
         * @property {number} NOLICENCE=10 NOLICENCE value
         * @property {number} LOCALRESOURCES=11 LOCALRESOURCES value
         * @property {number} BANDWIDTH=12 BANDWIDTH value
         * @property {number} COMPATIBILITY=13 COMPATIBILITY value
         * @property {number} CANTRECORD=14 CANTRECORD value
         */
        CallInfo.FailedCause = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNSET"] = 0;
            values[valuesById[1] = "UNSPECIFIED"] = 1;
            values[valuesById[2] = "UNALLOCATEDNUMBER"] = 2;
            values[valuesById[3] = "REJECTED"] = 3;
            values[valuesById[4] = "NUMBEROOO"] = 4;
            values[valuesById[5] = "NETWORKOOO"] = 5;
            values[valuesById[6] = "BARRED"] = 6;
            values[valuesById[7] = "NOCHANNEL"] = 7;
            values[valuesById[8] = "NOACCOUNTCODE"] = 8;
            values[valuesById[9] = "NOAUTHCODE"] = 9;
            values[valuesById[10] = "NOLICENCE"] = 10;
            values[valuesById[11] = "LOCALRESOURCES"] = 11;
            values[valuesById[12] = "BANDWIDTH"] = 12;
            values[valuesById[13] = "COMPATIBILITY"] = 13;
            values[valuesById[14] = "CANTRECORD"] = 14;
            return values;
        })();
    
        return CallInfo;
    })();
    
    $root.CallLost = (function() {
    
        /**
         * Properties of a CallLost.
         * @exports ICallLost
         * @interface ICallLost
         * @property {number|null} [callid] CallLost callid
         * @property {number|null} [referencecallid] CallLost referencecallid
         * @property {number|null} [reason] CallLost reason
         * @property {boolean|null} [thisenddropped] CallLost thisenddropped
         * @property {string|null} [description] CallLost description
         */
    
        /**
         * Constructs a new CallLost.
         * @exports CallLost
         * @classdesc Represents a CallLost.
         * @implements ICallLost
         * @constructor
         * @param {ICallLost=} [properties] Properties to set
         */
        function CallLost(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * CallLost callid.
         * @member {number} callid
         * @memberof CallLost
         * @instance
         */
        CallLost.prototype.callid = 0;
    
        /**
         * CallLost referencecallid.
         * @member {number} referencecallid
         * @memberof CallLost
         * @instance
         */
        CallLost.prototype.referencecallid = 0;
    
        /**
         * CallLost reason.
         * @member {number} reason
         * @memberof CallLost
         * @instance
         */
        CallLost.prototype.reason = 0;
    
        /**
         * CallLost thisenddropped.
         * @member {boolean} thisenddropped
         * @memberof CallLost
         * @instance
         */
        CallLost.prototype.thisenddropped = false;
    
        /**
         * CallLost description.
         * @member {string} description
         * @memberof CallLost
         * @instance
         */
        CallLost.prototype.description = "";
    
        /**
         * Creates a new CallLost instance using the specified properties.
         * @function create
         * @memberof CallLost
         * @static
         * @param {ICallLost=} [properties] Properties to set
         * @returns {CallLost} CallLost instance
         */
        CallLost.create = function create(properties) {
            return new CallLost(properties);
        };
    
        /**
         * Encodes the specified CallLost message. Does not implicitly {@link CallLost.verify|verify} messages.
         * @function encode
         * @memberof CallLost
         * @static
         * @param {ICallLost} message CallLost message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CallLost.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.callid != null && message.hasOwnProperty("callid"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.callid);
            if (message.referencecallid != null && message.hasOwnProperty("referencecallid"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.referencecallid);
            if (message.reason != null && message.hasOwnProperty("reason"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.reason);
            if (message.thisenddropped != null && message.hasOwnProperty("thisenddropped"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.thisenddropped);
            if (message.description != null && message.hasOwnProperty("description"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.description);
            return writer;
        };
    
        /**
         * Encodes the specified CallLost message, length delimited. Does not implicitly {@link CallLost.verify|verify} messages.
         * @function encodeDelimited
         * @memberof CallLost
         * @static
         * @param {ICallLost} message CallLost message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CallLost.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a CallLost message from the specified reader or buffer.
         * @function decode
         * @memberof CallLost
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {CallLost} CallLost
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CallLost.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CallLost();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.callid = reader.int32();
                    break;
                case 2:
                    message.referencecallid = reader.int32();
                    break;
                case 3:
                    message.reason = reader.int32();
                    break;
                case 4:
                    message.thisenddropped = reader.bool();
                    break;
                case 5:
                    message.description = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a CallLost message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof CallLost
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {CallLost} CallLost
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CallLost.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a CallLost message.
         * @function verify
         * @memberof CallLost
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CallLost.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.callid != null && message.hasOwnProperty("callid"))
                if (!$util.isInteger(message.callid))
                    return "callid: integer expected";
            if (message.referencecallid != null && message.hasOwnProperty("referencecallid"))
                if (!$util.isInteger(message.referencecallid))
                    return "referencecallid: integer expected";
            if (message.reason != null && message.hasOwnProperty("reason"))
                if (!$util.isInteger(message.reason))
                    return "reason: integer expected";
            if (message.thisenddropped != null && message.hasOwnProperty("thisenddropped"))
                if (typeof message.thisenddropped !== "boolean")
                    return "thisenddropped: boolean expected";
            if (message.description != null && message.hasOwnProperty("description"))
                if (!$util.isString(message.description))
                    return "description: string expected";
            return null;
        };
    
        /**
         * Creates a CallLost message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof CallLost
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {CallLost} CallLost
         */
        CallLost.fromObject = function fromObject(object) {
            if (object instanceof $root.CallLost)
                return object;
            var message = new $root.CallLost();
            if (object.callid != null)
                message.callid = object.callid | 0;
            if (object.referencecallid != null)
                message.referencecallid = object.referencecallid | 0;
            if (object.reason != null)
                message.reason = object.reason | 0;
            if (object.thisenddropped != null)
                message.thisenddropped = Boolean(object.thisenddropped);
            if (object.description != null)
                message.description = String(object.description);
            return message;
        };
    
        /**
         * Creates a plain object from a CallLost message. Also converts values to other types if specified.
         * @function toObject
         * @memberof CallLost
         * @static
         * @param {CallLost} message CallLost
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CallLost.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.callid = 0;
                object.referencecallid = 0;
                object.reason = 0;
                object.thisenddropped = false;
                object.description = "";
            }
            if (message.callid != null && message.hasOwnProperty("callid"))
                object.callid = message.callid;
            if (message.referencecallid != null && message.hasOwnProperty("referencecallid"))
                object.referencecallid = message.referencecallid;
            if (message.reason != null && message.hasOwnProperty("reason"))
                object.reason = message.reason;
            if (message.thisenddropped != null && message.hasOwnProperty("thisenddropped"))
                object.thisenddropped = message.thisenddropped;
            if (message.description != null && message.hasOwnProperty("description"))
                object.description = message.description;
            return object;
        };
    
        /**
         * Converts this CallLost to JSON.
         * @function toJSON
         * @memberof CallLost
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CallLost.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return CallLost;
    })();
    
    $root.ShortCodeData = (function() {
    
        /**
         * Properties of a ShortCodeData.
         * @exports IShortCodeData
         * @interface IShortCodeData
         * @property {number|null} [code] ShortCodeData code
         * @property {string|null} [val] ShortCodeData val
         */
    
        /**
         * Constructs a new ShortCodeData.
         * @exports ShortCodeData
         * @classdesc Represents a ShortCodeData.
         * @implements IShortCodeData
         * @constructor
         * @param {IShortCodeData=} [properties] Properties to set
         */
        function ShortCodeData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * ShortCodeData code.
         * @member {number} code
         * @memberof ShortCodeData
         * @instance
         */
        ShortCodeData.prototype.code = 0;
    
        /**
         * ShortCodeData val.
         * @member {string} val
         * @memberof ShortCodeData
         * @instance
         */
        ShortCodeData.prototype.val = "";
    
        /**
         * Creates a new ShortCodeData instance using the specified properties.
         * @function create
         * @memberof ShortCodeData
         * @static
         * @param {IShortCodeData=} [properties] Properties to set
         * @returns {ShortCodeData} ShortCodeData instance
         */
        ShortCodeData.create = function create(properties) {
            return new ShortCodeData(properties);
        };
    
        /**
         * Encodes the specified ShortCodeData message. Does not implicitly {@link ShortCodeData.verify|verify} messages.
         * @function encode
         * @memberof ShortCodeData
         * @static
         * @param {IShortCodeData} message ShortCodeData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ShortCodeData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && message.hasOwnProperty("code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.val != null && message.hasOwnProperty("val"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.val);
            return writer;
        };
    
        /**
         * Encodes the specified ShortCodeData message, length delimited. Does not implicitly {@link ShortCodeData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ShortCodeData
         * @static
         * @param {IShortCodeData} message ShortCodeData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ShortCodeData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a ShortCodeData message from the specified reader or buffer.
         * @function decode
         * @memberof ShortCodeData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ShortCodeData} ShortCodeData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ShortCodeData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ShortCodeData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.code = reader.int32();
                    break;
                case 2:
                    message.val = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a ShortCodeData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ShortCodeData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ShortCodeData} ShortCodeData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ShortCodeData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a ShortCodeData message.
         * @function verify
         * @memberof ShortCodeData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ShortCodeData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.val != null && message.hasOwnProperty("val"))
                if (!$util.isString(message.val))
                    return "val: string expected";
            return null;
        };
    
        /**
         * Creates a ShortCodeData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ShortCodeData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ShortCodeData} ShortCodeData
         */
        ShortCodeData.fromObject = function fromObject(object) {
            if (object instanceof $root.ShortCodeData)
                return object;
            var message = new $root.ShortCodeData();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.val != null)
                message.val = String(object.val);
            return message;
        };
    
        /**
         * Creates a plain object from a ShortCodeData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ShortCodeData
         * @static
         * @param {ShortCodeData} message ShortCodeData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ShortCodeData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.code = 0;
                object.val = "";
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.val != null && message.hasOwnProperty("val"))
                object.val = message.val;
            return object;
        };
    
        /**
         * Converts this ShortCodeData to JSON.
         * @function toJSON
         * @memberof ShortCodeData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ShortCodeData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return ShortCodeData;
    })();
    
    $root.MemberFunctionData = (function() {
    
        /**
         * Properties of a MemberFunctionData.
         * @exports IMemberFunctionData
         * @interface IMemberFunctionData
         * @property {number|null} [lref] MemberFunctionData lref
         * @property {MemberFunctionData.Action|null} [action] MemberFunctionData action
         */
    
        /**
         * Constructs a new MemberFunctionData.
         * @exports MemberFunctionData
         * @classdesc Represents a MemberFunctionData.
         * @implements IMemberFunctionData
         * @constructor
         * @param {IMemberFunctionData=} [properties] Properties to set
         */
        function MemberFunctionData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * MemberFunctionData lref.
         * @member {number} lref
         * @memberof MemberFunctionData
         * @instance
         */
        MemberFunctionData.prototype.lref = 0;
    
        /**
         * MemberFunctionData action.
         * @member {MemberFunctionData.Action} action
         * @memberof MemberFunctionData
         * @instance
         */
        MemberFunctionData.prototype.action = 0;
    
        /**
         * Creates a new MemberFunctionData instance using the specified properties.
         * @function create
         * @memberof MemberFunctionData
         * @static
         * @param {IMemberFunctionData=} [properties] Properties to set
         * @returns {MemberFunctionData} MemberFunctionData instance
         */
        MemberFunctionData.create = function create(properties) {
            return new MemberFunctionData(properties);
        };
    
        /**
         * Encodes the specified MemberFunctionData message. Does not implicitly {@link MemberFunctionData.verify|verify} messages.
         * @function encode
         * @memberof MemberFunctionData
         * @static
         * @param {IMemberFunctionData} message MemberFunctionData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MemberFunctionData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.lref != null && message.hasOwnProperty("lref"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.lref);
            if (message.action != null && message.hasOwnProperty("action"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.action);
            return writer;
        };
    
        /**
         * Encodes the specified MemberFunctionData message, length delimited. Does not implicitly {@link MemberFunctionData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MemberFunctionData
         * @static
         * @param {IMemberFunctionData} message MemberFunctionData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MemberFunctionData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a MemberFunctionData message from the specified reader or buffer.
         * @function decode
         * @memberof MemberFunctionData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MemberFunctionData} MemberFunctionData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MemberFunctionData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MemberFunctionData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.lref = reader.int32();
                    break;
                case 2:
                    message.action = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a MemberFunctionData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MemberFunctionData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MemberFunctionData} MemberFunctionData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MemberFunctionData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a MemberFunctionData message.
         * @function verify
         * @memberof MemberFunctionData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MemberFunctionData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.lref != null && message.hasOwnProperty("lref"))
                if (!$util.isInteger(message.lref))
                    return "lref: integer expected";
            if (message.action != null && message.hasOwnProperty("action"))
                switch (message.action) {
                default:
                    return "action: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            return null;
        };
    
        /**
         * Creates a MemberFunctionData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MemberFunctionData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MemberFunctionData} MemberFunctionData
         */
        MemberFunctionData.fromObject = function fromObject(object) {
            if (object instanceof $root.MemberFunctionData)
                return object;
            var message = new $root.MemberFunctionData();
            if (object.lref != null)
                message.lref = object.lref | 0;
            switch (object.action) {
            case "None":
            case 0:
                message.action = 0;
                break;
            case "DropCall":
            case 1:
                message.action = 1;
                break;
            case "MuteOn":
            case 2:
                message.action = 2;
                break;
            case "MuteOff":
            case 3:
                message.action = 3;
                break;
            }
            return message;
        };
    
        /**
         * Creates a plain object from a MemberFunctionData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MemberFunctionData
         * @static
         * @param {MemberFunctionData} message MemberFunctionData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MemberFunctionData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.lref = 0;
                object.action = options.enums === String ? "None" : 0;
            }
            if (message.lref != null && message.hasOwnProperty("lref"))
                object.lref = message.lref;
            if (message.action != null && message.hasOwnProperty("action"))
                object.action = options.enums === String ? $root.MemberFunctionData.Action[message.action] : message.action;
            return object;
        };
    
        /**
         * Converts this MemberFunctionData to JSON.
         * @function toJSON
         * @memberof MemberFunctionData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MemberFunctionData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Action enum.
         * @name MemberFunctionData.Action
         * @enum {string}
         * @property {number} None=0 None value
         * @property {number} DropCall=1 DropCall value
         * @property {number} MuteOn=2 MuteOn value
         * @property {number} MuteOff=3 MuteOff value
         */
        MemberFunctionData.Action = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "None"] = 0;
            values[valuesById[1] = "DropCall"] = 1;
            values[valuesById[2] = "MuteOn"] = 2;
            values[valuesById[3] = "MuteOff"] = 3;
            return values;
        })();
    
        return MemberFunctionData;
    })();
    
    $root.CallInstance = (function() {
    
        /**
         * Properties of a CallInstance.
         * @exports ICallInstance
         * @interface ICallInstance
         * @property {number|null} [callid] CallInstance callid
         * @property {number|null} [referencecallid] CallInstance referencecallid
         */
    
        /**
         * Constructs a new CallInstance.
         * @exports CallInstance
         * @classdesc Represents a CallInstance.
         * @implements ICallInstance
         * @constructor
         * @param {ICallInstance=} [properties] Properties to set
         */
        function CallInstance(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * CallInstance callid.
         * @member {number} callid
         * @memberof CallInstance
         * @instance
         */
        CallInstance.prototype.callid = 0;
    
        /**
         * CallInstance referencecallid.
         * @member {number} referencecallid
         * @memberof CallInstance
         * @instance
         */
        CallInstance.prototype.referencecallid = 0;
    
        /**
         * Creates a new CallInstance instance using the specified properties.
         * @function create
         * @memberof CallInstance
         * @static
         * @param {ICallInstance=} [properties] Properties to set
         * @returns {CallInstance} CallInstance instance
         */
        CallInstance.create = function create(properties) {
            return new CallInstance(properties);
        };
    
        /**
         * Encodes the specified CallInstance message. Does not implicitly {@link CallInstance.verify|verify} messages.
         * @function encode
         * @memberof CallInstance
         * @static
         * @param {ICallInstance} message CallInstance message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CallInstance.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.callid != null && message.hasOwnProperty("callid"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.callid);
            if (message.referencecallid != null && message.hasOwnProperty("referencecallid"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.referencecallid);
            return writer;
        };
    
        /**
         * Encodes the specified CallInstance message, length delimited. Does not implicitly {@link CallInstance.verify|verify} messages.
         * @function encodeDelimited
         * @memberof CallInstance
         * @static
         * @param {ICallInstance} message CallInstance message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CallInstance.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a CallInstance message from the specified reader or buffer.
         * @function decode
         * @memberof CallInstance
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {CallInstance} CallInstance
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CallInstance.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CallInstance();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.callid = reader.int32();
                    break;
                case 2:
                    message.referencecallid = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a CallInstance message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof CallInstance
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {CallInstance} CallInstance
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CallInstance.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a CallInstance message.
         * @function verify
         * @memberof CallInstance
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CallInstance.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.callid != null && message.hasOwnProperty("callid"))
                if (!$util.isInteger(message.callid))
                    return "callid: integer expected";
            if (message.referencecallid != null && message.hasOwnProperty("referencecallid"))
                if (!$util.isInteger(message.referencecallid))
                    return "referencecallid: integer expected";
            return null;
        };
    
        /**
         * Creates a CallInstance message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof CallInstance
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {CallInstance} CallInstance
         */
        CallInstance.fromObject = function fromObject(object) {
            if (object instanceof $root.CallInstance)
                return object;
            var message = new $root.CallInstance();
            if (object.callid != null)
                message.callid = object.callid | 0;
            if (object.referencecallid != null)
                message.referencecallid = object.referencecallid | 0;
            return message;
        };
    
        /**
         * Creates a plain object from a CallInstance message. Also converts values to other types if specified.
         * @function toObject
         * @memberof CallInstance
         * @static
         * @param {CallInstance} message CallInstance
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CallInstance.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.callid = 0;
                object.referencecallid = 0;
            }
            if (message.callid != null && message.hasOwnProperty("callid"))
                object.callid = message.callid;
            if (message.referencecallid != null && message.hasOwnProperty("referencecallid"))
                object.referencecallid = message.referencecallid;
            return object;
        };
    
        /**
         * Converts this CallInstance to JSON.
         * @function toJSON
         * @memberof CallInstance
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CallInstance.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return CallInstance;
    })();
    
    $root.CallFunction = (function() {
    
        /**
         * Properties of a CallFunction.
         * @exports ICallFunction
         * @interface ICallFunction
         * @property {CallFunction.Action|null} [action] CallFunction action
         * @property {string|null} [arg1] CallFunction arg1
         * @property {IShortCodeData|null} [shortcodedata] CallFunction shortcodedata
         * @property {IMemberFunctionData|null} [memberfunctiondata] CallFunction memberfunctiondata
         * @property {Array.<ICallInstance>|null} [callinst] CallFunction callinst
         * @property {string|null} [sdp] CallFunction sdp
         */
    
        /**
         * Constructs a new CallFunction.
         * @exports CallFunction
         * @classdesc Represents a CallFunction.
         * @implements ICallFunction
         * @constructor
         * @param {ICallFunction=} [properties] Properties to set
         */
        function CallFunction(properties) {
            this.callinst = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * CallFunction action.
         * @member {CallFunction.Action} action
         * @memberof CallFunction
         * @instance
         */
        CallFunction.prototype.action = 0;
    
        /**
         * CallFunction arg1.
         * @member {string} arg1
         * @memberof CallFunction
         * @instance
         */
        CallFunction.prototype.arg1 = "";
    
        /**
         * CallFunction shortcodedata.
         * @member {IShortCodeData|null|undefined} shortcodedata
         * @memberof CallFunction
         * @instance
         */
        CallFunction.prototype.shortcodedata = null;
    
        /**
         * CallFunction memberfunctiondata.
         * @member {IMemberFunctionData|null|undefined} memberfunctiondata
         * @memberof CallFunction
         * @instance
         */
        CallFunction.prototype.memberfunctiondata = null;
    
        /**
         * CallFunction callinst.
         * @member {Array.<ICallInstance>} callinst
         * @memberof CallFunction
         * @instance
         */
        CallFunction.prototype.callinst = $util.emptyArray;
    
        /**
         * CallFunction sdp.
         * @member {string} sdp
         * @memberof CallFunction
         * @instance
         */
        CallFunction.prototype.sdp = "";
    
        /**
         * Creates a new CallFunction instance using the specified properties.
         * @function create
         * @memberof CallFunction
         * @static
         * @param {ICallFunction=} [properties] Properties to set
         * @returns {CallFunction} CallFunction instance
         */
        CallFunction.create = function create(properties) {
            return new CallFunction(properties);
        };
    
        /**
         * Encodes the specified CallFunction message. Does not implicitly {@link CallFunction.verify|verify} messages.
         * @function encode
         * @memberof CallFunction
         * @static
         * @param {ICallFunction} message CallFunction message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CallFunction.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.action != null && message.hasOwnProperty("action"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.action);
            if (message.arg1 != null && message.hasOwnProperty("arg1"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.arg1);
            if (message.shortcodedata != null && message.hasOwnProperty("shortcodedata"))
                $root.ShortCodeData.encode(message.shortcodedata, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.memberfunctiondata != null && message.hasOwnProperty("memberfunctiondata"))
                $root.MemberFunctionData.encode(message.memberfunctiondata, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.callinst != null && message.callinst.length)
                for (var i = 0; i < message.callinst.length; ++i)
                    $root.CallInstance.encode(message.callinst[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.sdp != null && message.hasOwnProperty("sdp"))
                writer.uint32(/* id 100, wireType 2 =*/802).string(message.sdp);
            return writer;
        };
    
        /**
         * Encodes the specified CallFunction message, length delimited. Does not implicitly {@link CallFunction.verify|verify} messages.
         * @function encodeDelimited
         * @memberof CallFunction
         * @static
         * @param {ICallFunction} message CallFunction message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CallFunction.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a CallFunction message from the specified reader or buffer.
         * @function decode
         * @memberof CallFunction
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {CallFunction} CallFunction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CallFunction.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CallFunction();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.action = reader.int32();
                    break;
                case 2:
                    message.arg1 = reader.string();
                    break;
                case 3:
                    message.shortcodedata = $root.ShortCodeData.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.memberfunctiondata = $root.MemberFunctionData.decode(reader, reader.uint32());
                    break;
                case 5:
                    if (!(message.callinst && message.callinst.length))
                        message.callinst = [];
                    message.callinst.push($root.CallInstance.decode(reader, reader.uint32()));
                    break;
                case 100:
                    message.sdp = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a CallFunction message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof CallFunction
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {CallFunction} CallFunction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CallFunction.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a CallFunction message.
         * @function verify
         * @memberof CallFunction
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CallFunction.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.action != null && message.hasOwnProperty("action"))
                switch (message.action) {
                default:
                    return "action: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                case 21:
                case 22:
                case 23:
                case 24:
                case 25:
                case 26:
                case 27:
                case 28:
                case 29:
                case 30:
                    break;
                }
            if (message.arg1 != null && message.hasOwnProperty("arg1"))
                if (!$util.isString(message.arg1))
                    return "arg1: string expected";
            if (message.shortcodedata != null && message.hasOwnProperty("shortcodedata")) {
                var error = $root.ShortCodeData.verify(message.shortcodedata);
                if (error)
                    return "shortcodedata." + error;
            }
            if (message.memberfunctiondata != null && message.hasOwnProperty("memberfunctiondata")) {
                var error = $root.MemberFunctionData.verify(message.memberfunctiondata);
                if (error)
                    return "memberfunctiondata." + error;
            }
            if (message.callinst != null && message.hasOwnProperty("callinst")) {
                if (!Array.isArray(message.callinst))
                    return "callinst: array expected";
                for (var i = 0; i < message.callinst.length; ++i) {
                    var error = $root.CallInstance.verify(message.callinst[i]);
                    if (error)
                        return "callinst." + error;
                }
            }
            if (message.sdp != null && message.hasOwnProperty("sdp"))
                if (!$util.isString(message.sdp))
                    return "sdp: string expected";
            return null;
        };
    
        /**
         * Creates a CallFunction message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof CallFunction
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {CallFunction} CallFunction
         */
        CallFunction.fromObject = function fromObject(object) {
            if (object instanceof $root.CallFunction)
                return object;
            var message = new $root.CallFunction();
            switch (object.action) {
            case "None":
            case 0:
                message.action = 0;
                break;
            case "DropCall":
            case 1:
                message.action = 1;
                break;
            case "AnswerCall":
            case 2:
                message.action = 2;
                break;
            case "HoldCall":
            case 3:
                message.action = 3;
                break;
            case "UnHoldCall":
            case 4:
                message.action = 4;
                break;
            case "BlindTransfer":
            case 5:
                message.action = 5;
                break;
            case "Redirect":
            case 6:
                message.action = 6;
                break;
            case "Dial":
            case 7:
                message.action = 7;
                break;
            case "Park":
            case 8:
                message.action = 8;
                break;
            case "SetupTransfer":
            case 9:
                message.action = 9;
                break;
            case "SetupConf":
            case 10:
                message.action = 10;
                break;
            case "CompleteTransfer":
            case 11:
                message.action = 11;
                break;
            case "CompleteConf":
            case 12:
                message.action = 12;
                break;
            case "AddToConf":
            case 13:
                message.action = 13;
                break;
            case "MemberFunction":
            case 14:
                message.action = 14;
                break;
            case "SetTag":
            case 15:
                message.action = 15;
                break;
            case "SetAccountCode":
            case 16:
                message.action = 16;
                break;
            case "Unused16":
            case 17:
                message.action = 17;
                break;
            case "PushToEC500":
            case 18:
                message.action = 18;
                break;
            case "GenerateDigits":
            case 19:
                message.action = 19;
                break;
            case "ShortCodeAction":
            case 20:
                message.action = 20;
                break;
            case "UpdateSDP":
            case 21:
                message.action = 21;
                break;
            case "Unused21":
            case 22:
                message.action = 22;
                break;
            case "ForceClear":
            case 23:
                message.action = 23;
                break;
            case "SetAuthCode":
            case 24:
                message.action = 24;
                break;
            case "CallRecordingOn":
            case 25:
                message.action = 25;
                break;
            case "CallRecordingOff":
            case 26:
                message.action = 26;
                break;
            case "PrivacyOn":
            case 27:
                message.action = 27;
                break;
            case "PrivacyOff":
            case 28:
                message.action = 28;
                break;
            case "MuteOn":
            case 29:
                message.action = 29;
                break;
            case "MuteOff":
            case 30:
                message.action = 30;
                break;
            }
            if (object.arg1 != null)
                message.arg1 = String(object.arg1);
            if (object.shortcodedata != null) {
                if (typeof object.shortcodedata !== "object")
                    throw TypeError(".CallFunction.shortcodedata: object expected");
                message.shortcodedata = $root.ShortCodeData.fromObject(object.shortcodedata);
            }
            if (object.memberfunctiondata != null) {
                if (typeof object.memberfunctiondata !== "object")
                    throw TypeError(".CallFunction.memberfunctiondata: object expected");
                message.memberfunctiondata = $root.MemberFunctionData.fromObject(object.memberfunctiondata);
            }
            if (object.callinst) {
                if (!Array.isArray(object.callinst))
                    throw TypeError(".CallFunction.callinst: array expected");
                message.callinst = [];
                for (var i = 0; i < object.callinst.length; ++i) {
                    if (typeof object.callinst[i] !== "object")
                        throw TypeError(".CallFunction.callinst: object expected");
                    message.callinst[i] = $root.CallInstance.fromObject(object.callinst[i]);
                }
            }
            if (object.sdp != null)
                message.sdp = String(object.sdp);
            return message;
        };
    
        /**
         * Creates a plain object from a CallFunction message. Also converts values to other types if specified.
         * @function toObject
         * @memberof CallFunction
         * @static
         * @param {CallFunction} message CallFunction
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CallFunction.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.callinst = [];
            if (options.defaults) {
                object.action = options.enums === String ? "None" : 0;
                object.arg1 = "";
                object.shortcodedata = null;
                object.memberfunctiondata = null;
                object.sdp = "";
            }
            if (message.action != null && message.hasOwnProperty("action"))
                object.action = options.enums === String ? $root.CallFunction.Action[message.action] : message.action;
            if (message.arg1 != null && message.hasOwnProperty("arg1"))
                object.arg1 = message.arg1;
            if (message.shortcodedata != null && message.hasOwnProperty("shortcodedata"))
                object.shortcodedata = $root.ShortCodeData.toObject(message.shortcodedata, options);
            if (message.memberfunctiondata != null && message.hasOwnProperty("memberfunctiondata"))
                object.memberfunctiondata = $root.MemberFunctionData.toObject(message.memberfunctiondata, options);
            if (message.callinst && message.callinst.length) {
                object.callinst = [];
                for (var j = 0; j < message.callinst.length; ++j)
                    object.callinst[j] = $root.CallInstance.toObject(message.callinst[j], options);
            }
            if (message.sdp != null && message.hasOwnProperty("sdp"))
                object.sdp = message.sdp;
            return object;
        };
    
        /**
         * Converts this CallFunction to JSON.
         * @function toJSON
         * @memberof CallFunction
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CallFunction.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Action enum.
         * @name CallFunction.Action
         * @enum {string}
         * @property {number} None=0 None value
         * @property {number} DropCall=1 DropCall value
         * @property {number} AnswerCall=2 AnswerCall value
         * @property {number} HoldCall=3 HoldCall value
         * @property {number} UnHoldCall=4 UnHoldCall value
         * @property {number} BlindTransfer=5 BlindTransfer value
         * @property {number} Redirect=6 Redirect value
         * @property {number} Dial=7 Dial value
         * @property {number} Park=8 Park value
         * @property {number} SetupTransfer=9 SetupTransfer value
         * @property {number} SetupConf=10 SetupConf value
         * @property {number} CompleteTransfer=11 CompleteTransfer value
         * @property {number} CompleteConf=12 CompleteConf value
         * @property {number} AddToConf=13 AddToConf value
         * @property {number} MemberFunction=14 MemberFunction value
         * @property {number} SetTag=15 SetTag value
         * @property {number} SetAccountCode=16 SetAccountCode value
         * @property {number} Unused16=17 Unused16 value
         * @property {number} PushToEC500=18 PushToEC500 value
         * @property {number} GenerateDigits=19 GenerateDigits value
         * @property {number} ShortCodeAction=20 ShortCodeAction value
         * @property {number} UpdateSDP=21 UpdateSDP value
         * @property {number} Unused21=22 Unused21 value
         * @property {number} ForceClear=23 ForceClear value
         * @property {number} SetAuthCode=24 SetAuthCode value
         * @property {number} CallRecordingOn=25 CallRecordingOn value
         * @property {number} CallRecordingOff=26 CallRecordingOff value
         * @property {number} PrivacyOn=27 PrivacyOn value
         * @property {number} PrivacyOff=28 PrivacyOff value
         * @property {number} MuteOn=29 MuteOn value
         * @property {number} MuteOff=30 MuteOff value
         */
        CallFunction.Action = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "None"] = 0;
            values[valuesById[1] = "DropCall"] = 1;
            values[valuesById[2] = "AnswerCall"] = 2;
            values[valuesById[3] = "HoldCall"] = 3;
            values[valuesById[4] = "UnHoldCall"] = 4;
            values[valuesById[5] = "BlindTransfer"] = 5;
            values[valuesById[6] = "Redirect"] = 6;
            values[valuesById[7] = "Dial"] = 7;
            values[valuesById[8] = "Park"] = 8;
            values[valuesById[9] = "SetupTransfer"] = 9;
            values[valuesById[10] = "SetupConf"] = 10;
            values[valuesById[11] = "CompleteTransfer"] = 11;
            values[valuesById[12] = "CompleteConf"] = 12;
            values[valuesById[13] = "AddToConf"] = 13;
            values[valuesById[14] = "MemberFunction"] = 14;
            values[valuesById[15] = "SetTag"] = 15;
            values[valuesById[16] = "SetAccountCode"] = 16;
            values[valuesById[17] = "Unused16"] = 17;
            values[valuesById[18] = "PushToEC500"] = 18;
            values[valuesById[19] = "GenerateDigits"] = 19;
            values[valuesById[20] = "ShortCodeAction"] = 20;
            values[valuesById[21] = "UpdateSDP"] = 21;
            values[valuesById[22] = "Unused21"] = 22;
            values[valuesById[23] = "ForceClear"] = 23;
            values[valuesById[24] = "SetAuthCode"] = 24;
            values[valuesById[25] = "CallRecordingOn"] = 25;
            values[valuesById[26] = "CallRecordingOff"] = 26;
            values[valuesById[27] = "PrivacyOn"] = 27;
            values[valuesById[28] = "PrivacyOff"] = 28;
            values[valuesById[29] = "MuteOn"] = 29;
            values[valuesById[30] = "MuteOff"] = 30;
            return values;
        })();
    
        return CallFunction;
    })();
    
    $root.NotifyCallControl = (function() {
    
        /**
         * Properties of a NotifyCallControl.
         * @exports INotifyCallControl
         * @interface INotifyCallControl
         * @property {Array.<ICallInfo>|null} [callinfo] NotifyCallControl callinfo
         * @property {Array.<ICallLost>|null} [calllost] NotifyCallControl calllost
         */
    
        /**
         * Constructs a new NotifyCallControl.
         * @exports NotifyCallControl
         * @classdesc Represents a NotifyCallControl.
         * @implements INotifyCallControl
         * @constructor
         * @param {INotifyCallControl=} [properties] Properties to set
         */
        function NotifyCallControl(properties) {
            this.callinfo = [];
            this.calllost = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * NotifyCallControl callinfo.
         * @member {Array.<ICallInfo>} callinfo
         * @memberof NotifyCallControl
         * @instance
         */
        NotifyCallControl.prototype.callinfo = $util.emptyArray;
    
        /**
         * NotifyCallControl calllost.
         * @member {Array.<ICallLost>} calllost
         * @memberof NotifyCallControl
         * @instance
         */
        NotifyCallControl.prototype.calllost = $util.emptyArray;
    
        /**
         * Creates a new NotifyCallControl instance using the specified properties.
         * @function create
         * @memberof NotifyCallControl
         * @static
         * @param {INotifyCallControl=} [properties] Properties to set
         * @returns {NotifyCallControl} NotifyCallControl instance
         */
        NotifyCallControl.create = function create(properties) {
            return new NotifyCallControl(properties);
        };
    
        /**
         * Encodes the specified NotifyCallControl message. Does not implicitly {@link NotifyCallControl.verify|verify} messages.
         * @function encode
         * @memberof NotifyCallControl
         * @static
         * @param {INotifyCallControl} message NotifyCallControl message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyCallControl.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.callinfo != null && message.callinfo.length)
                for (var i = 0; i < message.callinfo.length; ++i)
                    $root.CallInfo.encode(message.callinfo[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.calllost != null && message.calllost.length)
                for (var i = 0; i < message.calllost.length; ++i)
                    $root.CallLost.encode(message.calllost[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified NotifyCallControl message, length delimited. Does not implicitly {@link NotifyCallControl.verify|verify} messages.
         * @function encodeDelimited
         * @memberof NotifyCallControl
         * @static
         * @param {INotifyCallControl} message NotifyCallControl message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyCallControl.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a NotifyCallControl message from the specified reader or buffer.
         * @function decode
         * @memberof NotifyCallControl
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {NotifyCallControl} NotifyCallControl
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyCallControl.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NotifyCallControl();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2:
                    if (!(message.callinfo && message.callinfo.length))
                        message.callinfo = [];
                    message.callinfo.push($root.CallInfo.decode(reader, reader.uint32()));
                    break;
                case 3:
                    if (!(message.calllost && message.calllost.length))
                        message.calllost = [];
                    message.calllost.push($root.CallLost.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a NotifyCallControl message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof NotifyCallControl
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {NotifyCallControl} NotifyCallControl
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyCallControl.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a NotifyCallControl message.
         * @function verify
         * @memberof NotifyCallControl
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NotifyCallControl.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.callinfo != null && message.hasOwnProperty("callinfo")) {
                if (!Array.isArray(message.callinfo))
                    return "callinfo: array expected";
                for (var i = 0; i < message.callinfo.length; ++i) {
                    var error = $root.CallInfo.verify(message.callinfo[i]);
                    if (error)
                        return "callinfo." + error;
                }
            }
            if (message.calllost != null && message.hasOwnProperty("calllost")) {
                if (!Array.isArray(message.calllost))
                    return "calllost: array expected";
                for (var i = 0; i < message.calllost.length; ++i) {
                    var error = $root.CallLost.verify(message.calllost[i]);
                    if (error)
                        return "calllost." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a NotifyCallControl message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof NotifyCallControl
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {NotifyCallControl} NotifyCallControl
         */
        NotifyCallControl.fromObject = function fromObject(object) {
            if (object instanceof $root.NotifyCallControl)
                return object;
            var message = new $root.NotifyCallControl();
            if (object.callinfo) {
                if (!Array.isArray(object.callinfo))
                    throw TypeError(".NotifyCallControl.callinfo: array expected");
                message.callinfo = [];
                for (var i = 0; i < object.callinfo.length; ++i) {
                    if (typeof object.callinfo[i] !== "object")
                        throw TypeError(".NotifyCallControl.callinfo: object expected");
                    message.callinfo[i] = $root.CallInfo.fromObject(object.callinfo[i]);
                }
            }
            if (object.calllost) {
                if (!Array.isArray(object.calllost))
                    throw TypeError(".NotifyCallControl.calllost: array expected");
                message.calllost = [];
                for (var i = 0; i < object.calllost.length; ++i) {
                    if (typeof object.calllost[i] !== "object")
                        throw TypeError(".NotifyCallControl.calllost: object expected");
                    message.calllost[i] = $root.CallLost.fromObject(object.calllost[i]);
                }
            }
            return message;
        };
    
        /**
         * Creates a plain object from a NotifyCallControl message. Also converts values to other types if specified.
         * @function toObject
         * @memberof NotifyCallControl
         * @static
         * @param {NotifyCallControl} message NotifyCallControl
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NotifyCallControl.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.callinfo = [];
                object.calllost = [];
            }
            if (message.callinfo && message.callinfo.length) {
                object.callinfo = [];
                for (var j = 0; j < message.callinfo.length; ++j)
                    object.callinfo[j] = $root.CallInfo.toObject(message.callinfo[j], options);
            }
            if (message.calllost && message.calllost.length) {
                object.calllost = [];
                for (var j = 0; j < message.calllost.length; ++j)
                    object.calllost[j] = $root.CallLost.toObject(message.calllost[j], options);
            }
            return object;
        };
    
        /**
         * Converts this NotifyCallControl to JSON.
         * @function toJSON
         * @memberof NotifyCallControl
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NotifyCallControl.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return NotifyCallControl;
    })();
    
    $root.TeleworkerConnection = (function() {
    
        /**
         * Properties of a TeleworkerConnection.
         * @exports ITeleworkerConnection
         * @interface ITeleworkerConnection
         * @property {string|null} [number] TeleworkerConnection number
         * @property {boolean|null} [holdlineopen] TeleworkerConnection holdlineopen
         * @property {number|null} [testconnection] TeleworkerConnection testconnection
         */
    
        /**
         * Constructs a new TeleworkerConnection.
         * @exports TeleworkerConnection
         * @classdesc Represents a TeleworkerConnection.
         * @implements ITeleworkerConnection
         * @constructor
         * @param {ITeleworkerConnection=} [properties] Properties to set
         */
        function TeleworkerConnection(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * TeleworkerConnection number.
         * @member {string} number
         * @memberof TeleworkerConnection
         * @instance
         */
        TeleworkerConnection.prototype.number = "";
    
        /**
         * TeleworkerConnection holdlineopen.
         * @member {boolean} holdlineopen
         * @memberof TeleworkerConnection
         * @instance
         */
        TeleworkerConnection.prototype.holdlineopen = false;
    
        /**
         * TeleworkerConnection testconnection.
         * @member {number} testconnection
         * @memberof TeleworkerConnection
         * @instance
         */
        TeleworkerConnection.prototype.testconnection = 0;
    
        /**
         * Creates a new TeleworkerConnection instance using the specified properties.
         * @function create
         * @memberof TeleworkerConnection
         * @static
         * @param {ITeleworkerConnection=} [properties] Properties to set
         * @returns {TeleworkerConnection} TeleworkerConnection instance
         */
        TeleworkerConnection.create = function create(properties) {
            return new TeleworkerConnection(properties);
        };
    
        /**
         * Encodes the specified TeleworkerConnection message. Does not implicitly {@link TeleworkerConnection.verify|verify} messages.
         * @function encode
         * @memberof TeleworkerConnection
         * @static
         * @param {ITeleworkerConnection} message TeleworkerConnection message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TeleworkerConnection.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.number != null && message.hasOwnProperty("number"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.number);
            if (message.holdlineopen != null && message.hasOwnProperty("holdlineopen"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.holdlineopen);
            if (message.testconnection != null && message.hasOwnProperty("testconnection"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.testconnection);
            return writer;
        };
    
        /**
         * Encodes the specified TeleworkerConnection message, length delimited. Does not implicitly {@link TeleworkerConnection.verify|verify} messages.
         * @function encodeDelimited
         * @memberof TeleworkerConnection
         * @static
         * @param {ITeleworkerConnection} message TeleworkerConnection message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TeleworkerConnection.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a TeleworkerConnection message from the specified reader or buffer.
         * @function decode
         * @memberof TeleworkerConnection
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {TeleworkerConnection} TeleworkerConnection
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TeleworkerConnection.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TeleworkerConnection();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.number = reader.string();
                    break;
                case 2:
                    message.holdlineopen = reader.bool();
                    break;
                case 3:
                    message.testconnection = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a TeleworkerConnection message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof TeleworkerConnection
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {TeleworkerConnection} TeleworkerConnection
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TeleworkerConnection.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a TeleworkerConnection message.
         * @function verify
         * @memberof TeleworkerConnection
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TeleworkerConnection.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.number != null && message.hasOwnProperty("number"))
                if (!$util.isString(message.number))
                    return "number: string expected";
            if (message.holdlineopen != null && message.hasOwnProperty("holdlineopen"))
                if (typeof message.holdlineopen !== "boolean")
                    return "holdlineopen: boolean expected";
            if (message.testconnection != null && message.hasOwnProperty("testconnection"))
                if (!$util.isInteger(message.testconnection))
                    return "testconnection: integer expected";
            return null;
        };
    
        /**
         * Creates a TeleworkerConnection message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof TeleworkerConnection
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {TeleworkerConnection} TeleworkerConnection
         */
        TeleworkerConnection.fromObject = function fromObject(object) {
            if (object instanceof $root.TeleworkerConnection)
                return object;
            var message = new $root.TeleworkerConnection();
            if (object.number != null)
                message.number = String(object.number);
            if (object.holdlineopen != null)
                message.holdlineopen = Boolean(object.holdlineopen);
            if (object.testconnection != null)
                message.testconnection = object.testconnection | 0;
            return message;
        };
    
        /**
         * Creates a plain object from a TeleworkerConnection message. Also converts values to other types if specified.
         * @function toObject
         * @memberof TeleworkerConnection
         * @static
         * @param {TeleworkerConnection} message TeleworkerConnection
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TeleworkerConnection.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.number = "";
                object.holdlineopen = false;
                object.testconnection = 0;
            }
            if (message.number != null && message.hasOwnProperty("number"))
                object.number = message.number;
            if (message.holdlineopen != null && message.hasOwnProperty("holdlineopen"))
                object.holdlineopen = message.holdlineopen;
            if (message.testconnection != null && message.hasOwnProperty("testconnection"))
                object.testconnection = message.testconnection;
            return object;
        };
    
        /**
         * Converts this TeleworkerConnection to JSON.
         * @function toJSON
         * @memberof TeleworkerConnection
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TeleworkerConnection.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return TeleworkerConnection;
    })();
    
    $root.LoginDesk = (function() {
    
        /**
         * Properties of a LoginDesk.
         * @exports ILoginDesk
         * @interface ILoginDesk
         * @property {string|null} [number] LoginDesk number
         * @property {string|null} [code] LoginDesk code
         */
    
        /**
         * Constructs a new LoginDesk.
         * @exports LoginDesk
         * @classdesc Represents a LoginDesk.
         * @implements ILoginDesk
         * @constructor
         * @param {ILoginDesk=} [properties] Properties to set
         */
        function LoginDesk(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * LoginDesk number.
         * @member {string} number
         * @memberof LoginDesk
         * @instance
         */
        LoginDesk.prototype.number = "";
    
        /**
         * LoginDesk code.
         * @member {string} code
         * @memberof LoginDesk
         * @instance
         */
        LoginDesk.prototype.code = "";
    
        /**
         * Creates a new LoginDesk instance using the specified properties.
         * @function create
         * @memberof LoginDesk
         * @static
         * @param {ILoginDesk=} [properties] Properties to set
         * @returns {LoginDesk} LoginDesk instance
         */
        LoginDesk.create = function create(properties) {
            return new LoginDesk(properties);
        };
    
        /**
         * Encodes the specified LoginDesk message. Does not implicitly {@link LoginDesk.verify|verify} messages.
         * @function encode
         * @memberof LoginDesk
         * @static
         * @param {ILoginDesk} message LoginDesk message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginDesk.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.number != null && message.hasOwnProperty("number"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.number);
            if (message.code != null && message.hasOwnProperty("code"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.code);
            return writer;
        };
    
        /**
         * Encodes the specified LoginDesk message, length delimited. Does not implicitly {@link LoginDesk.verify|verify} messages.
         * @function encodeDelimited
         * @memberof LoginDesk
         * @static
         * @param {ILoginDesk} message LoginDesk message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginDesk.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a LoginDesk message from the specified reader or buffer.
         * @function decode
         * @memberof LoginDesk
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {LoginDesk} LoginDesk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginDesk.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LoginDesk();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.number = reader.string();
                    break;
                case 2:
                    message.code = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a LoginDesk message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof LoginDesk
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {LoginDesk} LoginDesk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginDesk.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a LoginDesk message.
         * @function verify
         * @memberof LoginDesk
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginDesk.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.number != null && message.hasOwnProperty("number"))
                if (!$util.isString(message.number))
                    return "number: string expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isString(message.code))
                    return "code: string expected";
            return null;
        };
    
        /**
         * Creates a LoginDesk message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof LoginDesk
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {LoginDesk} LoginDesk
         */
        LoginDesk.fromObject = function fromObject(object) {
            if (object instanceof $root.LoginDesk)
                return object;
            var message = new $root.LoginDesk();
            if (object.number != null)
                message.number = String(object.number);
            if (object.code != null)
                message.code = String(object.code);
            return message;
        };
    
        /**
         * Creates a plain object from a LoginDesk message. Also converts values to other types if specified.
         * @function toObject
         * @memberof LoginDesk
         * @static
         * @param {LoginDesk} message LoginDesk
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginDesk.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.number = "";
                object.code = "";
            }
            if (message.number != null && message.hasOwnProperty("number"))
                object.number = message.number;
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            return object;
        };
    
        /**
         * Converts this LoginDesk to JSON.
         * @function toJSON
         * @memberof LoginDesk
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginDesk.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return LoginDesk;
    })();
    
    $root.SubscribeCallControl = (function() {
    
        /**
         * Properties of a SubscribeCallControl.
         * @exports ISubscribeCallControl
         * @interface ISubscribeCallControl
         * @property {number|null} [flags] SubscribeCallControl flags
         * @property {SubscribeCallControl.Attachment|null} [attachment] SubscribeCallControl attachment
         * @property {ITeleworkerConnection|null} [teleworkerconnection] SubscribeCallControl teleworkerconnection
         * @property {ILoginDesk|null} [logindesk] SubscribeCallControl logindesk
         * @property {SubscribeCallControl.WebRTCMode|null} [webrtcmode] SubscribeCallControl webrtcmode
         */
    
        /**
         * Constructs a new SubscribeCallControl.
         * @exports SubscribeCallControl
         * @classdesc Represents a SubscribeCallControl.
         * @implements ISubscribeCallControl
         * @constructor
         * @param {ISubscribeCallControl=} [properties] Properties to set
         */
        function SubscribeCallControl(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * SubscribeCallControl flags.
         * @member {number} flags
         * @memberof SubscribeCallControl
         * @instance
         */
        SubscribeCallControl.prototype.flags = 0;
    
        /**
         * SubscribeCallControl attachment.
         * @member {SubscribeCallControl.Attachment} attachment
         * @memberof SubscribeCallControl
         * @instance
         */
        SubscribeCallControl.prototype.attachment = 0;
    
        /**
         * SubscribeCallControl teleworkerconnection.
         * @member {ITeleworkerConnection|null|undefined} teleworkerconnection
         * @memberof SubscribeCallControl
         * @instance
         */
        SubscribeCallControl.prototype.teleworkerconnection = null;
    
        /**
         * SubscribeCallControl logindesk.
         * @member {ILoginDesk|null|undefined} logindesk
         * @memberof SubscribeCallControl
         * @instance
         */
        SubscribeCallControl.prototype.logindesk = null;
    
        /**
         * SubscribeCallControl webrtcmode.
         * @member {SubscribeCallControl.WebRTCMode} webrtcmode
         * @memberof SubscribeCallControl
         * @instance
         */
        SubscribeCallControl.prototype.webrtcmode = 0;
    
        /**
         * Creates a new SubscribeCallControl instance using the specified properties.
         * @function create
         * @memberof SubscribeCallControl
         * @static
         * @param {ISubscribeCallControl=} [properties] Properties to set
         * @returns {SubscribeCallControl} SubscribeCallControl instance
         */
        SubscribeCallControl.create = function create(properties) {
            return new SubscribeCallControl(properties);
        };
    
        /**
         * Encodes the specified SubscribeCallControl message. Does not implicitly {@link SubscribeCallControl.verify|verify} messages.
         * @function encode
         * @memberof SubscribeCallControl
         * @static
         * @param {ISubscribeCallControl} message SubscribeCallControl message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubscribeCallControl.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.flags != null && message.hasOwnProperty("flags"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.flags);
            if (message.attachment != null && message.hasOwnProperty("attachment"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.attachment);
            if (message.teleworkerconnection != null && message.hasOwnProperty("teleworkerconnection"))
                $root.TeleworkerConnection.encode(message.teleworkerconnection, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.logindesk != null && message.hasOwnProperty("logindesk"))
                $root.LoginDesk.encode(message.logindesk, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.webrtcmode != null && message.hasOwnProperty("webrtcmode"))
                writer.uint32(/* id 88, wireType 0 =*/704).int32(message.webrtcmode);
            return writer;
        };
    
        /**
         * Encodes the specified SubscribeCallControl message, length delimited. Does not implicitly {@link SubscribeCallControl.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SubscribeCallControl
         * @static
         * @param {ISubscribeCallControl} message SubscribeCallControl message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubscribeCallControl.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a SubscribeCallControl message from the specified reader or buffer.
         * @function decode
         * @memberof SubscribeCallControl
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SubscribeCallControl} SubscribeCallControl
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubscribeCallControl.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SubscribeCallControl();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.flags = reader.int32();
                    break;
                case 2:
                    message.attachment = reader.int32();
                    break;
                case 3:
                    message.teleworkerconnection = $root.TeleworkerConnection.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.logindesk = $root.LoginDesk.decode(reader, reader.uint32());
                    break;
                case 88:
                    message.webrtcmode = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a SubscribeCallControl message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SubscribeCallControl
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SubscribeCallControl} SubscribeCallControl
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubscribeCallControl.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a SubscribeCallControl message.
         * @function verify
         * @memberof SubscribeCallControl
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SubscribeCallControl.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.flags != null && message.hasOwnProperty("flags"))
                if (!$util.isInteger(message.flags))
                    return "flags: integer expected";
            if (message.attachment != null && message.hasOwnProperty("attachment"))
                switch (message.attachment) {
                default:
                    return "attachment: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    break;
                }
            if (message.teleworkerconnection != null && message.hasOwnProperty("teleworkerconnection")) {
                var error = $root.TeleworkerConnection.verify(message.teleworkerconnection);
                if (error)
                    return "teleworkerconnection." + error;
            }
            if (message.logindesk != null && message.hasOwnProperty("logindesk")) {
                var error = $root.LoginDesk.verify(message.logindesk);
                if (error)
                    return "logindesk." + error;
            }
            if (message.webrtcmode != null && message.hasOwnProperty("webrtcmode"))
                switch (message.webrtcmode) {
                default:
                    return "webrtcmode: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            return null;
        };
    
        /**
         * Creates a SubscribeCallControl message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SubscribeCallControl
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SubscribeCallControl} SubscribeCallControl
         */
        SubscribeCallControl.fromObject = function fromObject(object) {
            if (object instanceof $root.SubscribeCallControl)
                return object;
            var message = new $root.SubscribeCallControl();
            if (object.flags != null)
                message.flags = object.flags | 0;
            switch (object.attachment) {
            case "AttachmentUnspecified":
            case 0:
                message.attachment = 0;
                break;
            case "AttachmentThis":
            case 1:
                message.attachment = 1;
                break;
            case "AttachmentAny":
            case 2:
                message.attachment = 2;
                break;
            case "AttachmentDesk":
            case 3:
                message.attachment = 3;
                break;
            case "AttachmentSoftPhone":
            case 4:
                message.attachment = 4;
                break;
            case "AttachmentMobile":
            case 5:
                message.attachment = 5;
                break;
            case "AttachmentTeleworker":
            case 6:
                message.attachment = 6;
                break;
            case "AttachmentLoginDesk":
            case 7:
                message.attachment = 7;
                break;
            }
            if (object.teleworkerconnection != null) {
                if (typeof object.teleworkerconnection !== "object")
                    throw TypeError(".SubscribeCallControl.teleworkerconnection: object expected");
                message.teleworkerconnection = $root.TeleworkerConnection.fromObject(object.teleworkerconnection);
            }
            if (object.logindesk != null) {
                if (typeof object.logindesk !== "object")
                    throw TypeError(".SubscribeCallControl.logindesk: object expected");
                message.logindesk = $root.LoginDesk.fromObject(object.logindesk);
            }
            switch (object.webrtcmode) {
            case "WebRTCNone":
            case 0:
                message.webrtcmode = 0;
                break;
            case "WebRTCCallByCall":
            case 1:
                message.webrtcmode = 1;
                break;
            case "WebRTCShared":
            case 2:
                message.webrtcmode = 2;
                break;
            }
            return message;
        };
    
        /**
         * Creates a plain object from a SubscribeCallControl message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SubscribeCallControl
         * @static
         * @param {SubscribeCallControl} message SubscribeCallControl
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SubscribeCallControl.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.flags = 0;
                object.attachment = options.enums === String ? "AttachmentUnspecified" : 0;
                object.teleworkerconnection = null;
                object.logindesk = null;
                object.webrtcmode = options.enums === String ? "WebRTCNone" : 0;
            }
            if (message.flags != null && message.hasOwnProperty("flags"))
                object.flags = message.flags;
            if (message.attachment != null && message.hasOwnProperty("attachment"))
                object.attachment = options.enums === String ? $root.SubscribeCallControl.Attachment[message.attachment] : message.attachment;
            if (message.teleworkerconnection != null && message.hasOwnProperty("teleworkerconnection"))
                object.teleworkerconnection = $root.TeleworkerConnection.toObject(message.teleworkerconnection, options);
            if (message.logindesk != null && message.hasOwnProperty("logindesk"))
                object.logindesk = $root.LoginDesk.toObject(message.logindesk, options);
            if (message.webrtcmode != null && message.hasOwnProperty("webrtcmode"))
                object.webrtcmode = options.enums === String ? $root.SubscribeCallControl.WebRTCMode[message.webrtcmode] : message.webrtcmode;
            return object;
        };
    
        /**
         * Converts this SubscribeCallControl to JSON.
         * @function toJSON
         * @memberof SubscribeCallControl
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SubscribeCallControl.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        /**
         * Attachment enum.
         * @name SubscribeCallControl.Attachment
         * @enum {string}
         * @property {number} AttachmentUnspecified=0 AttachmentUnspecified value
         * @property {number} AttachmentThis=1 AttachmentThis value
         * @property {number} AttachmentAny=2 AttachmentAny value
         * @property {number} AttachmentDesk=3 AttachmentDesk value
         * @property {number} AttachmentSoftPhone=4 AttachmentSoftPhone value
         * @property {number} AttachmentMobile=5 AttachmentMobile value
         * @property {number} AttachmentTeleworker=6 AttachmentTeleworker value
         * @property {number} AttachmentLoginDesk=7 AttachmentLoginDesk value
         */
        SubscribeCallControl.Attachment = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "AttachmentUnspecified"] = 0;
            values[valuesById[1] = "AttachmentThis"] = 1;
            values[valuesById[2] = "AttachmentAny"] = 2;
            values[valuesById[3] = "AttachmentDesk"] = 3;
            values[valuesById[4] = "AttachmentSoftPhone"] = 4;
            values[valuesById[5] = "AttachmentMobile"] = 5;
            values[valuesById[6] = "AttachmentTeleworker"] = 6;
            values[valuesById[7] = "AttachmentLoginDesk"] = 7;
            return values;
        })();
    
        /**
         * WebRTCMode enum.
         * @name SubscribeCallControl.WebRTCMode
         * @enum {string}
         * @property {number} WebRTCNone=0 WebRTCNone value
         * @property {number} WebRTCCallByCall=1 WebRTCCallByCall value
         * @property {number} WebRTCShared=2 WebRTCShared value
         */
        SubscribeCallControl.WebRTCMode = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "WebRTCNone"] = 0;
            values[valuesById[1] = "WebRTCCallByCall"] = 1;
            values[valuesById[2] = "WebRTCShared"] = 2;
            return values;
        })();
    
        return SubscribeCallControl;
    })();
    
    $root.AdvancedMakeCall = (function() {
    
        /**
         * Properties of an AdvancedMakeCall.
         * @exports IAdvancedMakeCall
         * @interface IAdvancedMakeCall
         * @property {string|null} [accountcode] AdvancedMakeCall accountcode
         * @property {string|null} [authcode] AdvancedMakeCall authcode
         * @property {string|null} [tag] AdvancedMakeCall tag
         * @property {boolean|null} [withholdcli] AdvancedMakeCall withholdcli
         * @property {boolean|null} [privacy] AdvancedMakeCall privacy
         * @property {string|null} [madn] AdvancedMakeCall madn
         * @property {string|null} [subaddr] AdvancedMakeCall subaddr
         */
    
        /**
         * Constructs a new AdvancedMakeCall.
         * @exports AdvancedMakeCall
         * @classdesc Represents an AdvancedMakeCall.
         * @implements IAdvancedMakeCall
         * @constructor
         * @param {IAdvancedMakeCall=} [properties] Properties to set
         */
        function AdvancedMakeCall(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * AdvancedMakeCall accountcode.
         * @member {string} accountcode
         * @memberof AdvancedMakeCall
         * @instance
         */
        AdvancedMakeCall.prototype.accountcode = "";
    
        /**
         * AdvancedMakeCall authcode.
         * @member {string} authcode
         * @memberof AdvancedMakeCall
         * @instance
         */
        AdvancedMakeCall.prototype.authcode = "";
    
        /**
         * AdvancedMakeCall tag.
         * @member {string} tag
         * @memberof AdvancedMakeCall
         * @instance
         */
        AdvancedMakeCall.prototype.tag = "";
    
        /**
         * AdvancedMakeCall withholdcli.
         * @member {boolean} withholdcli
         * @memberof AdvancedMakeCall
         * @instance
         */
        AdvancedMakeCall.prototype.withholdcli = false;
    
        /**
         * AdvancedMakeCall privacy.
         * @member {boolean} privacy
         * @memberof AdvancedMakeCall
         * @instance
         */
        AdvancedMakeCall.prototype.privacy = false;
    
        /**
         * AdvancedMakeCall madn.
         * @member {string} madn
         * @memberof AdvancedMakeCall
         * @instance
         */
        AdvancedMakeCall.prototype.madn = "";
    
        /**
         * AdvancedMakeCall subaddr.
         * @member {string} subaddr
         * @memberof AdvancedMakeCall
         * @instance
         */
        AdvancedMakeCall.prototype.subaddr = "";
    
        /**
         * Creates a new AdvancedMakeCall instance using the specified properties.
         * @function create
         * @memberof AdvancedMakeCall
         * @static
         * @param {IAdvancedMakeCall=} [properties] Properties to set
         * @returns {AdvancedMakeCall} AdvancedMakeCall instance
         */
        AdvancedMakeCall.create = function create(properties) {
            return new AdvancedMakeCall(properties);
        };
    
        /**
         * Encodes the specified AdvancedMakeCall message. Does not implicitly {@link AdvancedMakeCall.verify|verify} messages.
         * @function encode
         * @memberof AdvancedMakeCall
         * @static
         * @param {IAdvancedMakeCall} message AdvancedMakeCall message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AdvancedMakeCall.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.accountcode != null && message.hasOwnProperty("accountcode"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.accountcode);
            if (message.authcode != null && message.hasOwnProperty("authcode"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.authcode);
            if (message.tag != null && message.hasOwnProperty("tag"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.tag);
            if (message.withholdcli != null && message.hasOwnProperty("withholdcli"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.withholdcli);
            if (message.privacy != null && message.hasOwnProperty("privacy"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.privacy);
            if (message.madn != null && message.hasOwnProperty("madn"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.madn);
            if (message.subaddr != null && message.hasOwnProperty("subaddr"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.subaddr);
            return writer;
        };
    
        /**
         * Encodes the specified AdvancedMakeCall message, length delimited. Does not implicitly {@link AdvancedMakeCall.verify|verify} messages.
         * @function encodeDelimited
         * @memberof AdvancedMakeCall
         * @static
         * @param {IAdvancedMakeCall} message AdvancedMakeCall message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AdvancedMakeCall.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an AdvancedMakeCall message from the specified reader or buffer.
         * @function decode
         * @memberof AdvancedMakeCall
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {AdvancedMakeCall} AdvancedMakeCall
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AdvancedMakeCall.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AdvancedMakeCall();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.accountcode = reader.string();
                    break;
                case 2:
                    message.authcode = reader.string();
                    break;
                case 3:
                    message.tag = reader.string();
                    break;
                case 5:
                    message.withholdcli = reader.bool();
                    break;
                case 6:
                    message.privacy = reader.bool();
                    break;
                case 7:
                    message.madn = reader.string();
                    break;
                case 8:
                    message.subaddr = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an AdvancedMakeCall message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof AdvancedMakeCall
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {AdvancedMakeCall} AdvancedMakeCall
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AdvancedMakeCall.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an AdvancedMakeCall message.
         * @function verify
         * @memberof AdvancedMakeCall
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AdvancedMakeCall.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.accountcode != null && message.hasOwnProperty("accountcode"))
                if (!$util.isString(message.accountcode))
                    return "accountcode: string expected";
            if (message.authcode != null && message.hasOwnProperty("authcode"))
                if (!$util.isString(message.authcode))
                    return "authcode: string expected";
            if (message.tag != null && message.hasOwnProperty("tag"))
                if (!$util.isString(message.tag))
                    return "tag: string expected";
            if (message.withholdcli != null && message.hasOwnProperty("withholdcli"))
                if (typeof message.withholdcli !== "boolean")
                    return "withholdcli: boolean expected";
            if (message.privacy != null && message.hasOwnProperty("privacy"))
                if (typeof message.privacy !== "boolean")
                    return "privacy: boolean expected";
            if (message.madn != null && message.hasOwnProperty("madn"))
                if (!$util.isString(message.madn))
                    return "madn: string expected";
            if (message.subaddr != null && message.hasOwnProperty("subaddr"))
                if (!$util.isString(message.subaddr))
                    return "subaddr: string expected";
            return null;
        };
    
        /**
         * Creates an AdvancedMakeCall message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof AdvancedMakeCall
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {AdvancedMakeCall} AdvancedMakeCall
         */
        AdvancedMakeCall.fromObject = function fromObject(object) {
            if (object instanceof $root.AdvancedMakeCall)
                return object;
            var message = new $root.AdvancedMakeCall();
            if (object.accountcode != null)
                message.accountcode = String(object.accountcode);
            if (object.authcode != null)
                message.authcode = String(object.authcode);
            if (object.tag != null)
                message.tag = String(object.tag);
            if (object.withholdcli != null)
                message.withholdcli = Boolean(object.withholdcli);
            if (object.privacy != null)
                message.privacy = Boolean(object.privacy);
            if (object.madn != null)
                message.madn = String(object.madn);
            if (object.subaddr != null)
                message.subaddr = String(object.subaddr);
            return message;
        };
    
        /**
         * Creates a plain object from an AdvancedMakeCall message. Also converts values to other types if specified.
         * @function toObject
         * @memberof AdvancedMakeCall
         * @static
         * @param {AdvancedMakeCall} message AdvancedMakeCall
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AdvancedMakeCall.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.accountcode = "";
                object.authcode = "";
                object.tag = "";
                object.withholdcli = false;
                object.privacy = false;
                object.madn = "";
                object.subaddr = "";
            }
            if (message.accountcode != null && message.hasOwnProperty("accountcode"))
                object.accountcode = message.accountcode;
            if (message.authcode != null && message.hasOwnProperty("authcode"))
                object.authcode = message.authcode;
            if (message.tag != null && message.hasOwnProperty("tag"))
                object.tag = message.tag;
            if (message.withholdcli != null && message.hasOwnProperty("withholdcli"))
                object.withholdcli = message.withholdcli;
            if (message.privacy != null && message.hasOwnProperty("privacy"))
                object.privacy = message.privacy;
            if (message.madn != null && message.hasOwnProperty("madn"))
                object.madn = message.madn;
            if (message.subaddr != null && message.hasOwnProperty("subaddr"))
                object.subaddr = message.subaddr;
            return object;
        };
    
        /**
         * Converts this AdvancedMakeCall to JSON.
         * @function toJSON
         * @memberof AdvancedMakeCall
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AdvancedMakeCall.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return AdvancedMakeCall;
    })();
    
    $root.MakeCall = (function() {
    
        /**
         * Properties of a MakeCall.
         * @exports IMakeCall
         * @interface IMakeCall
         * @property {string|null} [target] MakeCall target
         * @property {number|null} [type] MakeCall type
         * @property {IAdvancedMakeCall|null} [advanced] MakeCall advanced
         * @property {string|null} [sdp] MakeCall sdp
         */
    
        /**
         * Constructs a new MakeCall.
         * @exports MakeCall
         * @classdesc Represents a MakeCall.
         * @implements IMakeCall
         * @constructor
         * @param {IMakeCall=} [properties] Properties to set
         */
        function MakeCall(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * MakeCall target.
         * @member {string} target
         * @memberof MakeCall
         * @instance
         */
        MakeCall.prototype.target = "";
    
        /**
         * MakeCall type.
         * @member {number} type
         * @memberof MakeCall
         * @instance
         */
        MakeCall.prototype.type = 0;
    
        /**
         * MakeCall advanced.
         * @member {IAdvancedMakeCall|null|undefined} advanced
         * @memberof MakeCall
         * @instance
         */
        MakeCall.prototype.advanced = null;
    
        /**
         * MakeCall sdp.
         * @member {string} sdp
         * @memberof MakeCall
         * @instance
         */
        MakeCall.prototype.sdp = "";
    
        /**
         * Creates a new MakeCall instance using the specified properties.
         * @function create
         * @memberof MakeCall
         * @static
         * @param {IMakeCall=} [properties] Properties to set
         * @returns {MakeCall} MakeCall instance
         */
        MakeCall.create = function create(properties) {
            return new MakeCall(properties);
        };
    
        /**
         * Encodes the specified MakeCall message. Does not implicitly {@link MakeCall.verify|verify} messages.
         * @function encode
         * @memberof MakeCall
         * @static
         * @param {IMakeCall} message MakeCall message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MakeCall.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.target != null && message.hasOwnProperty("target"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.target);
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.type);
            if (message.advanced != null && message.hasOwnProperty("advanced"))
                $root.AdvancedMakeCall.encode(message.advanced, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.sdp != null && message.hasOwnProperty("sdp"))
                writer.uint32(/* id 100, wireType 2 =*/802).string(message.sdp);
            return writer;
        };
    
        /**
         * Encodes the specified MakeCall message, length delimited. Does not implicitly {@link MakeCall.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MakeCall
         * @static
         * @param {IMakeCall} message MakeCall message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MakeCall.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a MakeCall message from the specified reader or buffer.
         * @function decode
         * @memberof MakeCall
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MakeCall} MakeCall
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MakeCall.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MakeCall();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.target = reader.string();
                    break;
                case 2:
                    message.type = reader.int32();
                    break;
                case 3:
                    message.advanced = $root.AdvancedMakeCall.decode(reader, reader.uint32());
                    break;
                case 100:
                    message.sdp = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a MakeCall message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MakeCall
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MakeCall} MakeCall
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MakeCall.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a MakeCall message.
         * @function verify
         * @memberof MakeCall
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MakeCall.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.target != null && message.hasOwnProperty("target"))
                if (!$util.isString(message.target))
                    return "target: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isInteger(message.type))
                    return "type: integer expected";
            if (message.advanced != null && message.hasOwnProperty("advanced")) {
                var error = $root.AdvancedMakeCall.verify(message.advanced);
                if (error)
                    return "advanced." + error;
            }
            if (message.sdp != null && message.hasOwnProperty("sdp"))
                if (!$util.isString(message.sdp))
                    return "sdp: string expected";
            return null;
        };
    
        /**
         * Creates a MakeCall message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MakeCall
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MakeCall} MakeCall
         */
        MakeCall.fromObject = function fromObject(object) {
            if (object instanceof $root.MakeCall)
                return object;
            var message = new $root.MakeCall();
            if (object.target != null)
                message.target = String(object.target);
            if (object.type != null)
                message.type = object.type | 0;
            if (object.advanced != null) {
                if (typeof object.advanced !== "object")
                    throw TypeError(".MakeCall.advanced: object expected");
                message.advanced = $root.AdvancedMakeCall.fromObject(object.advanced);
            }
            if (object.sdp != null)
                message.sdp = String(object.sdp);
            return message;
        };
    
        /**
         * Creates a plain object from a MakeCall message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MakeCall
         * @static
         * @param {MakeCall} message MakeCall
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MakeCall.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.target = "";
                object.type = 0;
                object.advanced = null;
                object.sdp = "";
            }
            if (message.target != null && message.hasOwnProperty("target"))
                object.target = message.target;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.advanced != null && message.hasOwnProperty("advanced"))
                object.advanced = $root.AdvancedMakeCall.toObject(message.advanced, options);
            if (message.sdp != null && message.hasOwnProperty("sdp"))
                object.sdp = message.sdp;
            return object;
        };
    
        /**
         * Converts this MakeCall to JSON.
         * @function toJSON
         * @memberof MakeCall
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MakeCall.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return MakeCall;
    })();
    
    $root.UnParkCall = (function() {
    
        /**
         * Properties of an UnParkCall.
         * @exports IUnParkCall
         * @interface IUnParkCall
         * @property {string|null} [parkid] UnParkCall parkid
         * @property {string|null} [sdp] UnParkCall sdp
         */
    
        /**
         * Constructs a new UnParkCall.
         * @exports UnParkCall
         * @classdesc Represents an UnParkCall.
         * @implements IUnParkCall
         * @constructor
         * @param {IUnParkCall=} [properties] Properties to set
         */
        function UnParkCall(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * UnParkCall parkid.
         * @member {string} parkid
         * @memberof UnParkCall
         * @instance
         */
        UnParkCall.prototype.parkid = "";
    
        /**
         * UnParkCall sdp.
         * @member {string} sdp
         * @memberof UnParkCall
         * @instance
         */
        UnParkCall.prototype.sdp = "";
    
        /**
         * Creates a new UnParkCall instance using the specified properties.
         * @function create
         * @memberof UnParkCall
         * @static
         * @param {IUnParkCall=} [properties] Properties to set
         * @returns {UnParkCall} UnParkCall instance
         */
        UnParkCall.create = function create(properties) {
            return new UnParkCall(properties);
        };
    
        /**
         * Encodes the specified UnParkCall message. Does not implicitly {@link UnParkCall.verify|verify} messages.
         * @function encode
         * @memberof UnParkCall
         * @static
         * @param {IUnParkCall} message UnParkCall message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UnParkCall.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.parkid != null && message.hasOwnProperty("parkid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.parkid);
            if (message.sdp != null && message.hasOwnProperty("sdp"))
                writer.uint32(/* id 100, wireType 2 =*/802).string(message.sdp);
            return writer;
        };
    
        /**
         * Encodes the specified UnParkCall message, length delimited. Does not implicitly {@link UnParkCall.verify|verify} messages.
         * @function encodeDelimited
         * @memberof UnParkCall
         * @static
         * @param {IUnParkCall} message UnParkCall message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UnParkCall.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an UnParkCall message from the specified reader or buffer.
         * @function decode
         * @memberof UnParkCall
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {UnParkCall} UnParkCall
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UnParkCall.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UnParkCall();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.parkid = reader.string();
                    break;
                case 100:
                    message.sdp = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an UnParkCall message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof UnParkCall
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {UnParkCall} UnParkCall
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UnParkCall.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an UnParkCall message.
         * @function verify
         * @memberof UnParkCall
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UnParkCall.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.parkid != null && message.hasOwnProperty("parkid"))
                if (!$util.isString(message.parkid))
                    return "parkid: string expected";
            if (message.sdp != null && message.hasOwnProperty("sdp"))
                if (!$util.isString(message.sdp))
                    return "sdp: string expected";
            return null;
        };
    
        /**
         * Creates an UnParkCall message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof UnParkCall
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {UnParkCall} UnParkCall
         */
        UnParkCall.fromObject = function fromObject(object) {
            if (object instanceof $root.UnParkCall)
                return object;
            var message = new $root.UnParkCall();
            if (object.parkid != null)
                message.parkid = String(object.parkid);
            if (object.sdp != null)
                message.sdp = String(object.sdp);
            return message;
        };
    
        /**
         * Creates a plain object from an UnParkCall message. Also converts values to other types if specified.
         * @function toObject
         * @memberof UnParkCall
         * @static
         * @param {UnParkCall} message UnParkCall
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UnParkCall.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.parkid = "";
                object.sdp = "";
            }
            if (message.parkid != null && message.hasOwnProperty("parkid"))
                object.parkid = message.parkid;
            if (message.sdp != null && message.hasOwnProperty("sdp"))
                object.sdp = message.sdp;
            return object;
        };
    
        /**
         * Converts this UnParkCall to JSON.
         * @function toJSON
         * @memberof UnParkCall
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UnParkCall.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return UnParkCall;
    })();
    
    $root.UpdateCallControl = (function() {
    
        /**
         * Properties of an UpdateCallControl.
         * @exports IUpdateCallControl
         * @interface IUpdateCallControl
         * @property {number|null} [callid] UpdateCallControl callid
         * @property {number|null} [referencecallid] UpdateCallControl referencecallid
         * @property {IMakeCall|null} [makecall] UpdateCallControl makecall
         * @property {ICallFunction|null} [callfunction] UpdateCallControl callfunction
         * @property {IUnParkCall|null} [unparkcall] UpdateCallControl unparkcall
         */
    
        /**
         * Constructs a new UpdateCallControl.
         * @exports UpdateCallControl
         * @classdesc Represents an UpdateCallControl.
         * @implements IUpdateCallControl
         * @constructor
         * @param {IUpdateCallControl=} [properties] Properties to set
         */
        function UpdateCallControl(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * UpdateCallControl callid.
         * @member {number} callid
         * @memberof UpdateCallControl
         * @instance
         */
        UpdateCallControl.prototype.callid = 0;
    
        /**
         * UpdateCallControl referencecallid.
         * @member {number} referencecallid
         * @memberof UpdateCallControl
         * @instance
         */
        UpdateCallControl.prototype.referencecallid = 0;
    
        /**
         * UpdateCallControl makecall.
         * @member {IMakeCall|null|undefined} makecall
         * @memberof UpdateCallControl
         * @instance
         */
        UpdateCallControl.prototype.makecall = null;
    
        /**
         * UpdateCallControl callfunction.
         * @member {ICallFunction|null|undefined} callfunction
         * @memberof UpdateCallControl
         * @instance
         */
        UpdateCallControl.prototype.callfunction = null;
    
        /**
         * UpdateCallControl unparkcall.
         * @member {IUnParkCall|null|undefined} unparkcall
         * @memberof UpdateCallControl
         * @instance
         */
        UpdateCallControl.prototype.unparkcall = null;
    
        /**
         * Creates a new UpdateCallControl instance using the specified properties.
         * @function create
         * @memberof UpdateCallControl
         * @static
         * @param {IUpdateCallControl=} [properties] Properties to set
         * @returns {UpdateCallControl} UpdateCallControl instance
         */
        UpdateCallControl.create = function create(properties) {
            return new UpdateCallControl(properties);
        };
    
        /**
         * Encodes the specified UpdateCallControl message. Does not implicitly {@link UpdateCallControl.verify|verify} messages.
         * @function encode
         * @memberof UpdateCallControl
         * @static
         * @param {IUpdateCallControl} message UpdateCallControl message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateCallControl.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.callid != null && message.hasOwnProperty("callid"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.callid);
            if (message.referencecallid != null && message.hasOwnProperty("referencecallid"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.referencecallid);
            if (message.makecall != null && message.hasOwnProperty("makecall"))
                $root.MakeCall.encode(message.makecall, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.callfunction != null && message.hasOwnProperty("callfunction"))
                $root.CallFunction.encode(message.callfunction, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.unparkcall != null && message.hasOwnProperty("unparkcall"))
                $root.UnParkCall.encode(message.unparkcall, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified UpdateCallControl message, length delimited. Does not implicitly {@link UpdateCallControl.verify|verify} messages.
         * @function encodeDelimited
         * @memberof UpdateCallControl
         * @static
         * @param {IUpdateCallControl} message UpdateCallControl message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateCallControl.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an UpdateCallControl message from the specified reader or buffer.
         * @function decode
         * @memberof UpdateCallControl
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {UpdateCallControl} UpdateCallControl
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateCallControl.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UpdateCallControl();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.callid = reader.int32();
                    break;
                case 2:
                    message.referencecallid = reader.int32();
                    break;
                case 3:
                    message.makecall = $root.MakeCall.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.callfunction = $root.CallFunction.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.unparkcall = $root.UnParkCall.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an UpdateCallControl message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof UpdateCallControl
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {UpdateCallControl} UpdateCallControl
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateCallControl.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an UpdateCallControl message.
         * @function verify
         * @memberof UpdateCallControl
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateCallControl.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.callid != null && message.hasOwnProperty("callid"))
                if (!$util.isInteger(message.callid))
                    return "callid: integer expected";
            if (message.referencecallid != null && message.hasOwnProperty("referencecallid"))
                if (!$util.isInteger(message.referencecallid))
                    return "referencecallid: integer expected";
            if (message.makecall != null && message.hasOwnProperty("makecall")) {
                var error = $root.MakeCall.verify(message.makecall);
                if (error)
                    return "makecall." + error;
            }
            if (message.callfunction != null && message.hasOwnProperty("callfunction")) {
                var error = $root.CallFunction.verify(message.callfunction);
                if (error)
                    return "callfunction." + error;
            }
            if (message.unparkcall != null && message.hasOwnProperty("unparkcall")) {
                var error = $root.UnParkCall.verify(message.unparkcall);
                if (error)
                    return "unparkcall." + error;
            }
            return null;
        };
    
        /**
         * Creates an UpdateCallControl message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof UpdateCallControl
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {UpdateCallControl} UpdateCallControl
         */
        UpdateCallControl.fromObject = function fromObject(object) {
            if (object instanceof $root.UpdateCallControl)
                return object;
            var message = new $root.UpdateCallControl();
            if (object.callid != null)
                message.callid = object.callid | 0;
            if (object.referencecallid != null)
                message.referencecallid = object.referencecallid | 0;
            if (object.makecall != null) {
                if (typeof object.makecall !== "object")
                    throw TypeError(".UpdateCallControl.makecall: object expected");
                message.makecall = $root.MakeCall.fromObject(object.makecall);
            }
            if (object.callfunction != null) {
                if (typeof object.callfunction !== "object")
                    throw TypeError(".UpdateCallControl.callfunction: object expected");
                message.callfunction = $root.CallFunction.fromObject(object.callfunction);
            }
            if (object.unparkcall != null) {
                if (typeof object.unparkcall !== "object")
                    throw TypeError(".UpdateCallControl.unparkcall: object expected");
                message.unparkcall = $root.UnParkCall.fromObject(object.unparkcall);
            }
            return message;
        };
    
        /**
         * Creates a plain object from an UpdateCallControl message. Also converts values to other types if specified.
         * @function toObject
         * @memberof UpdateCallControl
         * @static
         * @param {UpdateCallControl} message UpdateCallControl
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateCallControl.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.callid = 0;
                object.referencecallid = 0;
                object.makecall = null;
                object.callfunction = null;
                object.unparkcall = null;
            }
            if (message.callid != null && message.hasOwnProperty("callid"))
                object.callid = message.callid;
            if (message.referencecallid != null && message.hasOwnProperty("referencecallid"))
                object.referencecallid = message.referencecallid;
            if (message.makecall != null && message.hasOwnProperty("makecall"))
                object.makecall = $root.MakeCall.toObject(message.makecall, options);
            if (message.callfunction != null && message.hasOwnProperty("callfunction"))
                object.callfunction = $root.CallFunction.toObject(message.callfunction, options);
            if (message.unparkcall != null && message.hasOwnProperty("unparkcall"))
                object.unparkcall = $root.UnParkCall.toObject(message.unparkcall, options);
            return object;
        };
    
        /**
         * Converts this UpdateCallControl to JSON.
         * @function toJSON
         * @memberof UpdateCallControl
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateCallControl.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return UpdateCallControl;
    })();
    
    $root.Absence = (function() {
    
        /**
         * Properties of an Absence.
         * @exports IAbsence
         * @interface IAbsence
         * @property {number|null} [msg] Absence msg
         * @property {string|null} [str] Absence str
         */
    
        /**
         * Constructs a new Absence.
         * @exports Absence
         * @classdesc Represents an Absence.
         * @implements IAbsence
         * @constructor
         * @param {IAbsence=} [properties] Properties to set
         */
        function Absence(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * Absence msg.
         * @member {number} msg
         * @memberof Absence
         * @instance
         */
        Absence.prototype.msg = 0;
    
        /**
         * Absence str.
         * @member {string} str
         * @memberof Absence
         * @instance
         */
        Absence.prototype.str = "";
    
        /**
         * Creates a new Absence instance using the specified properties.
         * @function create
         * @memberof Absence
         * @static
         * @param {IAbsence=} [properties] Properties to set
         * @returns {Absence} Absence instance
         */
        Absence.create = function create(properties) {
            return new Absence(properties);
        };
    
        /**
         * Encodes the specified Absence message. Does not implicitly {@link Absence.verify|verify} messages.
         * @function encode
         * @memberof Absence
         * @static
         * @param {IAbsence} message Absence message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Absence.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.msg != null && message.hasOwnProperty("msg"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.msg);
            if (message.str != null && message.hasOwnProperty("str"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.str);
            return writer;
        };
    
        /**
         * Encodes the specified Absence message, length delimited. Does not implicitly {@link Absence.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Absence
         * @static
         * @param {IAbsence} message Absence message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Absence.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an Absence message from the specified reader or buffer.
         * @function decode
         * @memberof Absence
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Absence} Absence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Absence.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Absence();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.msg = reader.int32();
                    break;
                case 2:
                    message.str = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an Absence message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Absence
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Absence} Absence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Absence.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an Absence message.
         * @function verify
         * @memberof Absence
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Absence.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isInteger(message.msg))
                    return "msg: integer expected";
            if (message.str != null && message.hasOwnProperty("str"))
                if (!$util.isString(message.str))
                    return "str: string expected";
            return null;
        };
    
        /**
         * Creates an Absence message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Absence
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Absence} Absence
         */
        Absence.fromObject = function fromObject(object) {
            if (object instanceof $root.Absence)
                return object;
            var message = new $root.Absence();
            if (object.msg != null)
                message.msg = object.msg | 0;
            if (object.str != null)
                message.str = String(object.str);
            return message;
        };
    
        /**
         * Creates a plain object from an Absence message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Absence
         * @static
         * @param {Absence} message Absence
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Absence.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.msg = 0;
                object.str = "";
            }
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            if (message.str != null && message.hasOwnProperty("str"))
                object.str = message.str;
            return object;
        };
    
        /**
         * Converts this Absence to JSON.
         * @function toJSON
         * @memberof Absence
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Absence.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return Absence;
    })();
    
    $root.FwdInfo = (function() {
    
        /**
         * Properties of a FwdInfo.
         * @exports IFwdInfo
         * @interface IFwdInfo
         * @property {boolean|null} [voicemailon] FwdInfo voicemailon
         * @property {boolean|null} [fwdu] FwdInfo fwdu
         * @property {boolean|null} [fwdb] FwdInfo fwdb
         * @property {boolean|null} [fwdna] FwdInfo fwdna
         * @property {boolean|null} [fwdhg] FwdInfo fwdhg
         * @property {number|null} [noanswertime] FwdInfo noanswertime
         * @property {string|null} [fwduNumber] FwdInfo fwduNumber
         * @property {string|null} [fwdbNumber] FwdInfo fwdbNumber
         */
    
        /**
         * Constructs a new FwdInfo.
         * @exports FwdInfo
         * @classdesc Represents a FwdInfo.
         * @implements IFwdInfo
         * @constructor
         * @param {IFwdInfo=} [properties] Properties to set
         */
        function FwdInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * FwdInfo voicemailon.
         * @member {boolean} voicemailon
         * @memberof FwdInfo
         * @instance
         */
        FwdInfo.prototype.voicemailon = false;
    
        /**
         * FwdInfo fwdu.
         * @member {boolean} fwdu
         * @memberof FwdInfo
         * @instance
         */
        FwdInfo.prototype.fwdu = false;
    
        /**
         * FwdInfo fwdb.
         * @member {boolean} fwdb
         * @memberof FwdInfo
         * @instance
         */
        FwdInfo.prototype.fwdb = false;
    
        /**
         * FwdInfo fwdna.
         * @member {boolean} fwdna
         * @memberof FwdInfo
         * @instance
         */
        FwdInfo.prototype.fwdna = false;
    
        /**
         * FwdInfo fwdhg.
         * @member {boolean} fwdhg
         * @memberof FwdInfo
         * @instance
         */
        FwdInfo.prototype.fwdhg = false;
    
        /**
         * FwdInfo noanswertime.
         * @member {number} noanswertime
         * @memberof FwdInfo
         * @instance
         */
        FwdInfo.prototype.noanswertime = 0;
    
        /**
         * FwdInfo fwduNumber.
         * @member {string} fwduNumber
         * @memberof FwdInfo
         * @instance
         */
        FwdInfo.prototype.fwduNumber = "";
    
        /**
         * FwdInfo fwdbNumber.
         * @member {string} fwdbNumber
         * @memberof FwdInfo
         * @instance
         */
        FwdInfo.prototype.fwdbNumber = "";
    
        /**
         * Creates a new FwdInfo instance using the specified properties.
         * @function create
         * @memberof FwdInfo
         * @static
         * @param {IFwdInfo=} [properties] Properties to set
         * @returns {FwdInfo} FwdInfo instance
         */
        FwdInfo.create = function create(properties) {
            return new FwdInfo(properties);
        };
    
        /**
         * Encodes the specified FwdInfo message. Does not implicitly {@link FwdInfo.verify|verify} messages.
         * @function encode
         * @memberof FwdInfo
         * @static
         * @param {IFwdInfo} message FwdInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FwdInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.voicemailon != null && message.hasOwnProperty("voicemailon"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.voicemailon);
            if (message.fwdu != null && message.hasOwnProperty("fwdu"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.fwdu);
            if (message.fwdb != null && message.hasOwnProperty("fwdb"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.fwdb);
            if (message.fwdna != null && message.hasOwnProperty("fwdna"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.fwdna);
            if (message.fwdhg != null && message.hasOwnProperty("fwdhg"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.fwdhg);
            if (message.noanswertime != null && message.hasOwnProperty("noanswertime"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.noanswertime);
            if (message.fwduNumber != null && message.hasOwnProperty("fwduNumber"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.fwduNumber);
            if (message.fwdbNumber != null && message.hasOwnProperty("fwdbNumber"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.fwdbNumber);
            return writer;
        };
    
        /**
         * Encodes the specified FwdInfo message, length delimited. Does not implicitly {@link FwdInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof FwdInfo
         * @static
         * @param {IFwdInfo} message FwdInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FwdInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a FwdInfo message from the specified reader or buffer.
         * @function decode
         * @memberof FwdInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {FwdInfo} FwdInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FwdInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.FwdInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.voicemailon = reader.bool();
                    break;
                case 2:
                    message.fwdu = reader.bool();
                    break;
                case 3:
                    message.fwdb = reader.bool();
                    break;
                case 4:
                    message.fwdna = reader.bool();
                    break;
                case 5:
                    message.fwdhg = reader.bool();
                    break;
                case 6:
                    message.noanswertime = reader.int32();
                    break;
                case 7:
                    message.fwduNumber = reader.string();
                    break;
                case 8:
                    message.fwdbNumber = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a FwdInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof FwdInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {FwdInfo} FwdInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FwdInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a FwdInfo message.
         * @function verify
         * @memberof FwdInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FwdInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.voicemailon != null && message.hasOwnProperty("voicemailon"))
                if (typeof message.voicemailon !== "boolean")
                    return "voicemailon: boolean expected";
            if (message.fwdu != null && message.hasOwnProperty("fwdu"))
                if (typeof message.fwdu !== "boolean")
                    return "fwdu: boolean expected";
            if (message.fwdb != null && message.hasOwnProperty("fwdb"))
                if (typeof message.fwdb !== "boolean")
                    return "fwdb: boolean expected";
            if (message.fwdna != null && message.hasOwnProperty("fwdna"))
                if (typeof message.fwdna !== "boolean")
                    return "fwdna: boolean expected";
            if (message.fwdhg != null && message.hasOwnProperty("fwdhg"))
                if (typeof message.fwdhg !== "boolean")
                    return "fwdhg: boolean expected";
            if (message.noanswertime != null && message.hasOwnProperty("noanswertime"))
                if (!$util.isInteger(message.noanswertime))
                    return "noanswertime: integer expected";
            if (message.fwduNumber != null && message.hasOwnProperty("fwduNumber"))
                if (!$util.isString(message.fwduNumber))
                    return "fwduNumber: string expected";
            if (message.fwdbNumber != null && message.hasOwnProperty("fwdbNumber"))
                if (!$util.isString(message.fwdbNumber))
                    return "fwdbNumber: string expected";
            return null;
        };
    
        /**
         * Creates a FwdInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof FwdInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {FwdInfo} FwdInfo
         */
        FwdInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.FwdInfo)
                return object;
            var message = new $root.FwdInfo();
            if (object.voicemailon != null)
                message.voicemailon = Boolean(object.voicemailon);
            if (object.fwdu != null)
                message.fwdu = Boolean(object.fwdu);
            if (object.fwdb != null)
                message.fwdb = Boolean(object.fwdb);
            if (object.fwdna != null)
                message.fwdna = Boolean(object.fwdna);
            if (object.fwdhg != null)
                message.fwdhg = Boolean(object.fwdhg);
            if (object.noanswertime != null)
                message.noanswertime = object.noanswertime | 0;
            if (object.fwduNumber != null)
                message.fwduNumber = String(object.fwduNumber);
            if (object.fwdbNumber != null)
                message.fwdbNumber = String(object.fwdbNumber);
            return message;
        };
    
        /**
         * Creates a plain object from a FwdInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof FwdInfo
         * @static
         * @param {FwdInfo} message FwdInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FwdInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.voicemailon = false;
                object.fwdu = false;
                object.fwdb = false;
                object.fwdna = false;
                object.fwdhg = false;
                object.noanswertime = 0;
                object.fwduNumber = "";
                object.fwdbNumber = "";
            }
            if (message.voicemailon != null && message.hasOwnProperty("voicemailon"))
                object.voicemailon = message.voicemailon;
            if (message.fwdu != null && message.hasOwnProperty("fwdu"))
                object.fwdu = message.fwdu;
            if (message.fwdb != null && message.hasOwnProperty("fwdb"))
                object.fwdb = message.fwdb;
            if (message.fwdna != null && message.hasOwnProperty("fwdna"))
                object.fwdna = message.fwdna;
            if (message.fwdhg != null && message.hasOwnProperty("fwdhg"))
                object.fwdhg = message.fwdhg;
            if (message.noanswertime != null && message.hasOwnProperty("noanswertime"))
                object.noanswertime = message.noanswertime;
            if (message.fwduNumber != null && message.hasOwnProperty("fwduNumber"))
                object.fwduNumber = message.fwduNumber;
            if (message.fwdbNumber != null && message.hasOwnProperty("fwdbNumber"))
                object.fwdbNumber = message.fwdbNumber;
            return object;
        };
    
        /**
         * Converts this FwdInfo to JSON.
         * @function toJSON
         * @memberof FwdInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FwdInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return FwdInfo;
    })();
    
    $root.NotifyEquinoxPresentity = (function() {
    
        /**
         * Properties of a NotifyEquinoxPresentity.
         * @exports INotifyEquinoxPresentity
         * @interface INotifyEquinoxPresentity
         * @property {string|null} [presentity] NotifyEquinoxPresentity presentity
         * @property {number|null} [lref] NotifyEquinoxPresentity lref
         * @property {boolean|null} [sac] NotifyEquinoxPresentity sac
         * @property {number|null} [phonestate] NotifyEquinoxPresentity phonestate
         * @property {IAbsence|null} [absence] NotifyEquinoxPresentity absence
         * @property {string|null} [app] NotifyEquinoxPresentity app
         * @property {boolean|null} [fwdu] NotifyEquinoxPresentity fwdu
         * @property {number|null} [vmunreadMessages] NotifyEquinoxPresentity vmunreadMessages
         */
    
        /**
         * Constructs a new NotifyEquinoxPresentity.
         * @exports NotifyEquinoxPresentity
         * @classdesc Represents a NotifyEquinoxPresentity.
         * @implements INotifyEquinoxPresentity
         * @constructor
         * @param {INotifyEquinoxPresentity=} [properties] Properties to set
         */
        function NotifyEquinoxPresentity(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * NotifyEquinoxPresentity presentity.
         * @member {string} presentity
         * @memberof NotifyEquinoxPresentity
         * @instance
         */
        NotifyEquinoxPresentity.prototype.presentity = "";
    
        /**
         * NotifyEquinoxPresentity lref.
         * @member {number} lref
         * @memberof NotifyEquinoxPresentity
         * @instance
         */
        NotifyEquinoxPresentity.prototype.lref = 0;
    
        /**
         * NotifyEquinoxPresentity sac.
         * @member {boolean} sac
         * @memberof NotifyEquinoxPresentity
         * @instance
         */
        NotifyEquinoxPresentity.prototype.sac = false;
    
        /**
         * NotifyEquinoxPresentity phonestate.
         * @member {number} phonestate
         * @memberof NotifyEquinoxPresentity
         * @instance
         */
        NotifyEquinoxPresentity.prototype.phonestate = 0;
    
        /**
         * NotifyEquinoxPresentity absence.
         * @member {IAbsence|null|undefined} absence
         * @memberof NotifyEquinoxPresentity
         * @instance
         */
        NotifyEquinoxPresentity.prototype.absence = null;
    
        /**
         * NotifyEquinoxPresentity app.
         * @member {string} app
         * @memberof NotifyEquinoxPresentity
         * @instance
         */
        NotifyEquinoxPresentity.prototype.app = "";
    
        /**
         * NotifyEquinoxPresentity fwdu.
         * @member {boolean} fwdu
         * @memberof NotifyEquinoxPresentity
         * @instance
         */
        NotifyEquinoxPresentity.prototype.fwdu = false;
    
        /**
         * NotifyEquinoxPresentity vmunreadMessages.
         * @member {number} vmunreadMessages
         * @memberof NotifyEquinoxPresentity
         * @instance
         */
        NotifyEquinoxPresentity.prototype.vmunreadMessages = 0;
    
        /**
         * Creates a new NotifyEquinoxPresentity instance using the specified properties.
         * @function create
         * @memberof NotifyEquinoxPresentity
         * @static
         * @param {INotifyEquinoxPresentity=} [properties] Properties to set
         * @returns {NotifyEquinoxPresentity} NotifyEquinoxPresentity instance
         */
        NotifyEquinoxPresentity.create = function create(properties) {
            return new NotifyEquinoxPresentity(properties);
        };
    
        /**
         * Encodes the specified NotifyEquinoxPresentity message. Does not implicitly {@link NotifyEquinoxPresentity.verify|verify} messages.
         * @function encode
         * @memberof NotifyEquinoxPresentity
         * @static
         * @param {INotifyEquinoxPresentity} message NotifyEquinoxPresentity message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyEquinoxPresentity.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.presentity != null && message.hasOwnProperty("presentity"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.presentity);
            if (message.lref != null && message.hasOwnProperty("lref"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.lref);
            if (message.sac != null && message.hasOwnProperty("sac"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.sac);
            if (message.phonestate != null && message.hasOwnProperty("phonestate"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.phonestate);
            if (message.absence != null && message.hasOwnProperty("absence"))
                $root.Absence.encode(message.absence, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.app != null && message.hasOwnProperty("app"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.app);
            if (message.fwdu != null && message.hasOwnProperty("fwdu"))
                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.fwdu);
            if (message.vmunreadMessages != null && message.hasOwnProperty("vmunreadMessages"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.vmunreadMessages);
            return writer;
        };
    
        /**
         * Encodes the specified NotifyEquinoxPresentity message, length delimited. Does not implicitly {@link NotifyEquinoxPresentity.verify|verify} messages.
         * @function encodeDelimited
         * @memberof NotifyEquinoxPresentity
         * @static
         * @param {INotifyEquinoxPresentity} message NotifyEquinoxPresentity message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyEquinoxPresentity.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a NotifyEquinoxPresentity message from the specified reader or buffer.
         * @function decode
         * @memberof NotifyEquinoxPresentity
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {NotifyEquinoxPresentity} NotifyEquinoxPresentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyEquinoxPresentity.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NotifyEquinoxPresentity();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.presentity = reader.string();
                    break;
                case 2:
                    message.lref = reader.int32();
                    break;
                case 3:
                    message.sac = reader.bool();
                    break;
                case 4:
                    message.phonestate = reader.int32();
                    break;
                case 5:
                    message.absence = $root.Absence.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.app = reader.string();
                    break;
                case 7:
                    message.fwdu = reader.bool();
                    break;
                case 8:
                    message.vmunreadMessages = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a NotifyEquinoxPresentity message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof NotifyEquinoxPresentity
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {NotifyEquinoxPresentity} NotifyEquinoxPresentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyEquinoxPresentity.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a NotifyEquinoxPresentity message.
         * @function verify
         * @memberof NotifyEquinoxPresentity
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NotifyEquinoxPresentity.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.presentity != null && message.hasOwnProperty("presentity"))
                if (!$util.isString(message.presentity))
                    return "presentity: string expected";
            if (message.lref != null && message.hasOwnProperty("lref"))
                if (!$util.isInteger(message.lref))
                    return "lref: integer expected";
            if (message.sac != null && message.hasOwnProperty("sac"))
                if (typeof message.sac !== "boolean")
                    return "sac: boolean expected";
            if (message.phonestate != null && message.hasOwnProperty("phonestate"))
                if (!$util.isInteger(message.phonestate))
                    return "phonestate: integer expected";
            if (message.absence != null && message.hasOwnProperty("absence")) {
                var error = $root.Absence.verify(message.absence);
                if (error)
                    return "absence." + error;
            }
            if (message.app != null && message.hasOwnProperty("app"))
                if (!$util.isString(message.app))
                    return "app: string expected";
            if (message.fwdu != null && message.hasOwnProperty("fwdu"))
                if (typeof message.fwdu !== "boolean")
                    return "fwdu: boolean expected";
            if (message.vmunreadMessages != null && message.hasOwnProperty("vmunreadMessages"))
                if (!$util.isInteger(message.vmunreadMessages))
                    return "vmunreadMessages: integer expected";
            return null;
        };
    
        /**
         * Creates a NotifyEquinoxPresentity message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof NotifyEquinoxPresentity
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {NotifyEquinoxPresentity} NotifyEquinoxPresentity
         */
        NotifyEquinoxPresentity.fromObject = function fromObject(object) {
            if (object instanceof $root.NotifyEquinoxPresentity)
                return object;
            var message = new $root.NotifyEquinoxPresentity();
            if (object.presentity != null)
                message.presentity = String(object.presentity);
            if (object.lref != null)
                message.lref = object.lref | 0;
            if (object.sac != null)
                message.sac = Boolean(object.sac);
            if (object.phonestate != null)
                message.phonestate = object.phonestate | 0;
            if (object.absence != null) {
                if (typeof object.absence !== "object")
                    throw TypeError(".NotifyEquinoxPresentity.absence: object expected");
                message.absence = $root.Absence.fromObject(object.absence);
            }
            if (object.app != null)
                message.app = String(object.app);
            if (object.fwdu != null)
                message.fwdu = Boolean(object.fwdu);
            if (object.vmunreadMessages != null)
                message.vmunreadMessages = object.vmunreadMessages | 0;
            return message;
        };
    
        /**
         * Creates a plain object from a NotifyEquinoxPresentity message. Also converts values to other types if specified.
         * @function toObject
         * @memberof NotifyEquinoxPresentity
         * @static
         * @param {NotifyEquinoxPresentity} message NotifyEquinoxPresentity
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NotifyEquinoxPresentity.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.presentity = "";
                object.lref = 0;
                object.sac = false;
                object.phonestate = 0;
                object.absence = null;
                object.app = "";
                object.fwdu = false;
                object.vmunreadMessages = 0;
            }
            if (message.presentity != null && message.hasOwnProperty("presentity"))
                object.presentity = message.presentity;
            if (message.lref != null && message.hasOwnProperty("lref"))
                object.lref = message.lref;
            if (message.sac != null && message.hasOwnProperty("sac"))
                object.sac = message.sac;
            if (message.phonestate != null && message.hasOwnProperty("phonestate"))
                object.phonestate = message.phonestate;
            if (message.absence != null && message.hasOwnProperty("absence"))
                object.absence = $root.Absence.toObject(message.absence, options);
            if (message.app != null && message.hasOwnProperty("app"))
                object.app = message.app;
            if (message.fwdu != null && message.hasOwnProperty("fwdu"))
                object.fwdu = message.fwdu;
            if (message.vmunreadMessages != null && message.hasOwnProperty("vmunreadMessages"))
                object.vmunreadMessages = message.vmunreadMessages;
            return object;
        };
    
        /**
         * Converts this NotifyEquinoxPresentity to JSON.
         * @function toJSON
         * @memberof NotifyEquinoxPresentity
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NotifyEquinoxPresentity.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return NotifyEquinoxPresentity;
    })();
    
    $root.EquinoxPresentity = (function() {
    
        /**
         * Properties of an EquinoxPresentity.
         * @exports IEquinoxPresentity
         * @interface IEquinoxPresentity
         * @property {string|null} [presentity] EquinoxPresentity presentity
         * @property {number|null} [lref] EquinoxPresentity lref
         */
    
        /**
         * Constructs a new EquinoxPresentity.
         * @exports EquinoxPresentity
         * @classdesc Represents an EquinoxPresentity.
         * @implements IEquinoxPresentity
         * @constructor
         * @param {IEquinoxPresentity=} [properties] Properties to set
         */
        function EquinoxPresentity(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * EquinoxPresentity presentity.
         * @member {string} presentity
         * @memberof EquinoxPresentity
         * @instance
         */
        EquinoxPresentity.prototype.presentity = "";
    
        /**
         * EquinoxPresentity lref.
         * @member {number} lref
         * @memberof EquinoxPresentity
         * @instance
         */
        EquinoxPresentity.prototype.lref = 0;
    
        /**
         * Creates a new EquinoxPresentity instance using the specified properties.
         * @function create
         * @memberof EquinoxPresentity
         * @static
         * @param {IEquinoxPresentity=} [properties] Properties to set
         * @returns {EquinoxPresentity} EquinoxPresentity instance
         */
        EquinoxPresentity.create = function create(properties) {
            return new EquinoxPresentity(properties);
        };
    
        /**
         * Encodes the specified EquinoxPresentity message. Does not implicitly {@link EquinoxPresentity.verify|verify} messages.
         * @function encode
         * @memberof EquinoxPresentity
         * @static
         * @param {IEquinoxPresentity} message EquinoxPresentity message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EquinoxPresentity.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.presentity != null && message.hasOwnProperty("presentity"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.presentity);
            if (message.lref != null && message.hasOwnProperty("lref"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.lref);
            return writer;
        };
    
        /**
         * Encodes the specified EquinoxPresentity message, length delimited. Does not implicitly {@link EquinoxPresentity.verify|verify} messages.
         * @function encodeDelimited
         * @memberof EquinoxPresentity
         * @static
         * @param {IEquinoxPresentity} message EquinoxPresentity message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EquinoxPresentity.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an EquinoxPresentity message from the specified reader or buffer.
         * @function decode
         * @memberof EquinoxPresentity
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {EquinoxPresentity} EquinoxPresentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EquinoxPresentity.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.EquinoxPresentity();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.presentity = reader.string();
                    break;
                case 2:
                    message.lref = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an EquinoxPresentity message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof EquinoxPresentity
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {EquinoxPresentity} EquinoxPresentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EquinoxPresentity.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an EquinoxPresentity message.
         * @function verify
         * @memberof EquinoxPresentity
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EquinoxPresentity.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.presentity != null && message.hasOwnProperty("presentity"))
                if (!$util.isString(message.presentity))
                    return "presentity: string expected";
            if (message.lref != null && message.hasOwnProperty("lref"))
                if (!$util.isInteger(message.lref))
                    return "lref: integer expected";
            return null;
        };
    
        /**
         * Creates an EquinoxPresentity message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof EquinoxPresentity
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {EquinoxPresentity} EquinoxPresentity
         */
        EquinoxPresentity.fromObject = function fromObject(object) {
            if (object instanceof $root.EquinoxPresentity)
                return object;
            var message = new $root.EquinoxPresentity();
            if (object.presentity != null)
                message.presentity = String(object.presentity);
            if (object.lref != null)
                message.lref = object.lref | 0;
            return message;
        };
    
        /**
         * Creates a plain object from an EquinoxPresentity message. Also converts values to other types if specified.
         * @function toObject
         * @memberof EquinoxPresentity
         * @static
         * @param {EquinoxPresentity} message EquinoxPresentity
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EquinoxPresentity.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.presentity = "";
                object.lref = 0;
            }
            if (message.presentity != null && message.hasOwnProperty("presentity"))
                object.presentity = message.presentity;
            if (message.lref != null && message.hasOwnProperty("lref"))
                object.lref = message.lref;
            return object;
        };
    
        /**
         * Converts this EquinoxPresentity to JSON.
         * @function toJSON
         * @memberof EquinoxPresentity
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EquinoxPresentity.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return EquinoxPresentity;
    })();
    
    $root.NotifyEquinoxPresence = (function() {
    
        /**
         * Properties of a NotifyEquinoxPresence.
         * @exports INotifyEquinoxPresence
         * @interface INotifyEquinoxPresence
         * @property {number|null} [full] NotifyEquinoxPresence full
         * @property {Array.<INotifyEquinoxPresentity>|null} [entry] NotifyEquinoxPresence entry
         */
    
        /**
         * Constructs a new NotifyEquinoxPresence.
         * @exports NotifyEquinoxPresence
         * @classdesc Represents a NotifyEquinoxPresence.
         * @implements INotifyEquinoxPresence
         * @constructor
         * @param {INotifyEquinoxPresence=} [properties] Properties to set
         */
        function NotifyEquinoxPresence(properties) {
            this.entry = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * NotifyEquinoxPresence full.
         * @member {number} full
         * @memberof NotifyEquinoxPresence
         * @instance
         */
        NotifyEquinoxPresence.prototype.full = 0;
    
        /**
         * NotifyEquinoxPresence entry.
         * @member {Array.<INotifyEquinoxPresentity>} entry
         * @memberof NotifyEquinoxPresence
         * @instance
         */
        NotifyEquinoxPresence.prototype.entry = $util.emptyArray;
    
        /**
         * Creates a new NotifyEquinoxPresence instance using the specified properties.
         * @function create
         * @memberof NotifyEquinoxPresence
         * @static
         * @param {INotifyEquinoxPresence=} [properties] Properties to set
         * @returns {NotifyEquinoxPresence} NotifyEquinoxPresence instance
         */
        NotifyEquinoxPresence.create = function create(properties) {
            return new NotifyEquinoxPresence(properties);
        };
    
        /**
         * Encodes the specified NotifyEquinoxPresence message. Does not implicitly {@link NotifyEquinoxPresence.verify|verify} messages.
         * @function encode
         * @memberof NotifyEquinoxPresence
         * @static
         * @param {INotifyEquinoxPresence} message NotifyEquinoxPresence message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyEquinoxPresence.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.full != null && message.hasOwnProperty("full"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.full);
            if (message.entry != null && message.entry.length)
                for (var i = 0; i < message.entry.length; ++i)
                    $root.NotifyEquinoxPresentity.encode(message.entry[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified NotifyEquinoxPresence message, length delimited. Does not implicitly {@link NotifyEquinoxPresence.verify|verify} messages.
         * @function encodeDelimited
         * @memberof NotifyEquinoxPresence
         * @static
         * @param {INotifyEquinoxPresence} message NotifyEquinoxPresence message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyEquinoxPresence.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a NotifyEquinoxPresence message from the specified reader or buffer.
         * @function decode
         * @memberof NotifyEquinoxPresence
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {NotifyEquinoxPresence} NotifyEquinoxPresence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyEquinoxPresence.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NotifyEquinoxPresence();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.full = reader.int32();
                    break;
                case 2:
                    if (!(message.entry && message.entry.length))
                        message.entry = [];
                    message.entry.push($root.NotifyEquinoxPresentity.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a NotifyEquinoxPresence message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof NotifyEquinoxPresence
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {NotifyEquinoxPresence} NotifyEquinoxPresence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyEquinoxPresence.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a NotifyEquinoxPresence message.
         * @function verify
         * @memberof NotifyEquinoxPresence
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NotifyEquinoxPresence.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.full != null && message.hasOwnProperty("full"))
                if (!$util.isInteger(message.full))
                    return "full: integer expected";
            if (message.entry != null && message.hasOwnProperty("entry")) {
                if (!Array.isArray(message.entry))
                    return "entry: array expected";
                for (var i = 0; i < message.entry.length; ++i) {
                    var error = $root.NotifyEquinoxPresentity.verify(message.entry[i]);
                    if (error)
                        return "entry." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a NotifyEquinoxPresence message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof NotifyEquinoxPresence
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {NotifyEquinoxPresence} NotifyEquinoxPresence
         */
        NotifyEquinoxPresence.fromObject = function fromObject(object) {
            if (object instanceof $root.NotifyEquinoxPresence)
                return object;
            var message = new $root.NotifyEquinoxPresence();
            if (object.full != null)
                message.full = object.full | 0;
            if (object.entry) {
                if (!Array.isArray(object.entry))
                    throw TypeError(".NotifyEquinoxPresence.entry: array expected");
                message.entry = [];
                for (var i = 0; i < object.entry.length; ++i) {
                    if (typeof object.entry[i] !== "object")
                        throw TypeError(".NotifyEquinoxPresence.entry: object expected");
                    message.entry[i] = $root.NotifyEquinoxPresentity.fromObject(object.entry[i]);
                }
            }
            return message;
        };
    
        /**
         * Creates a plain object from a NotifyEquinoxPresence message. Also converts values to other types if specified.
         * @function toObject
         * @memberof NotifyEquinoxPresence
         * @static
         * @param {NotifyEquinoxPresence} message NotifyEquinoxPresence
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NotifyEquinoxPresence.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.entry = [];
            if (options.defaults)
                object.full = 0;
            if (message.full != null && message.hasOwnProperty("full"))
                object.full = message.full;
            if (message.entry && message.entry.length) {
                object.entry = [];
                for (var j = 0; j < message.entry.length; ++j)
                    object.entry[j] = $root.NotifyEquinoxPresentity.toObject(message.entry[j], options);
            }
            return object;
        };
    
        /**
         * Converts this NotifyEquinoxPresence to JSON.
         * @function toJSON
         * @memberof NotifyEquinoxPresence
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NotifyEquinoxPresence.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return NotifyEquinoxPresence;
    })();
    
    $root.SubscribeEquinoxPresence = (function() {
    
        /**
         * Properties of a SubscribeEquinoxPresence.
         * @exports ISubscribeEquinoxPresence
         * @interface ISubscribeEquinoxPresence
         * @property {Array.<IEquinoxPresentity>|null} [entry] SubscribeEquinoxPresence entry
         * @property {number|null} [flags] SubscribeEquinoxPresence flags
         */
    
        /**
         * Constructs a new SubscribeEquinoxPresence.
         * @exports SubscribeEquinoxPresence
         * @classdesc Represents a SubscribeEquinoxPresence.
         * @implements ISubscribeEquinoxPresence
         * @constructor
         * @param {ISubscribeEquinoxPresence=} [properties] Properties to set
         */
        function SubscribeEquinoxPresence(properties) {
            this.entry = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * SubscribeEquinoxPresence entry.
         * @member {Array.<IEquinoxPresentity>} entry
         * @memberof SubscribeEquinoxPresence
         * @instance
         */
        SubscribeEquinoxPresence.prototype.entry = $util.emptyArray;
    
        /**
         * SubscribeEquinoxPresence flags.
         * @member {number} flags
         * @memberof SubscribeEquinoxPresence
         * @instance
         */
        SubscribeEquinoxPresence.prototype.flags = 0;
    
        /**
         * Creates a new SubscribeEquinoxPresence instance using the specified properties.
         * @function create
         * @memberof SubscribeEquinoxPresence
         * @static
         * @param {ISubscribeEquinoxPresence=} [properties] Properties to set
         * @returns {SubscribeEquinoxPresence} SubscribeEquinoxPresence instance
         */
        SubscribeEquinoxPresence.create = function create(properties) {
            return new SubscribeEquinoxPresence(properties);
        };
    
        /**
         * Encodes the specified SubscribeEquinoxPresence message. Does not implicitly {@link SubscribeEquinoxPresence.verify|verify} messages.
         * @function encode
         * @memberof SubscribeEquinoxPresence
         * @static
         * @param {ISubscribeEquinoxPresence} message SubscribeEquinoxPresence message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubscribeEquinoxPresence.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.entry != null && message.entry.length)
                for (var i = 0; i < message.entry.length; ++i)
                    $root.EquinoxPresentity.encode(message.entry[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.flags != null && message.hasOwnProperty("flags"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.flags);
            return writer;
        };
    
        /**
         * Encodes the specified SubscribeEquinoxPresence message, length delimited. Does not implicitly {@link SubscribeEquinoxPresence.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SubscribeEquinoxPresence
         * @static
         * @param {ISubscribeEquinoxPresence} message SubscribeEquinoxPresence message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubscribeEquinoxPresence.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a SubscribeEquinoxPresence message from the specified reader or buffer.
         * @function decode
         * @memberof SubscribeEquinoxPresence
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SubscribeEquinoxPresence} SubscribeEquinoxPresence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubscribeEquinoxPresence.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SubscribeEquinoxPresence();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.entry && message.entry.length))
                        message.entry = [];
                    message.entry.push($root.EquinoxPresentity.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.flags = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a SubscribeEquinoxPresence message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SubscribeEquinoxPresence
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SubscribeEquinoxPresence} SubscribeEquinoxPresence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubscribeEquinoxPresence.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a SubscribeEquinoxPresence message.
         * @function verify
         * @memberof SubscribeEquinoxPresence
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SubscribeEquinoxPresence.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.entry != null && message.hasOwnProperty("entry")) {
                if (!Array.isArray(message.entry))
                    return "entry: array expected";
                for (var i = 0; i < message.entry.length; ++i) {
                    var error = $root.EquinoxPresentity.verify(message.entry[i]);
                    if (error)
                        return "entry." + error;
                }
            }
            if (message.flags != null && message.hasOwnProperty("flags"))
                if (!$util.isInteger(message.flags))
                    return "flags: integer expected";
            return null;
        };
    
        /**
         * Creates a SubscribeEquinoxPresence message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SubscribeEquinoxPresence
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SubscribeEquinoxPresence} SubscribeEquinoxPresence
         */
        SubscribeEquinoxPresence.fromObject = function fromObject(object) {
            if (object instanceof $root.SubscribeEquinoxPresence)
                return object;
            var message = new $root.SubscribeEquinoxPresence();
            if (object.entry) {
                if (!Array.isArray(object.entry))
                    throw TypeError(".SubscribeEquinoxPresence.entry: array expected");
                message.entry = [];
                for (var i = 0; i < object.entry.length; ++i) {
                    if (typeof object.entry[i] !== "object")
                        throw TypeError(".SubscribeEquinoxPresence.entry: object expected");
                    message.entry[i] = $root.EquinoxPresentity.fromObject(object.entry[i]);
                }
            }
            if (object.flags != null)
                message.flags = object.flags | 0;
            return message;
        };
    
        /**
         * Creates a plain object from a SubscribeEquinoxPresence message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SubscribeEquinoxPresence
         * @static
         * @param {SubscribeEquinoxPresence} message SubscribeEquinoxPresence
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SubscribeEquinoxPresence.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.entry = [];
            if (options.defaults)
                object.flags = 0;
            if (message.entry && message.entry.length) {
                object.entry = [];
                for (var j = 0; j < message.entry.length; ++j)
                    object.entry[j] = $root.EquinoxPresentity.toObject(message.entry[j], options);
            }
            if (message.flags != null && message.hasOwnProperty("flags"))
                object.flags = message.flags;
            return object;
        };
    
        /**
         * Converts this SubscribeEquinoxPresence to JSON.
         * @function toJSON
         * @memberof SubscribeEquinoxPresence
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SubscribeEquinoxPresence.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return SubscribeEquinoxPresence;
    })();
    
    $root.UpdateEquinoxSAC = (function() {
    
        /**
         * Properties of an UpdateEquinoxSAC.
         * @exports IUpdateEquinoxSAC
         * @interface IUpdateEquinoxSAC
         * @property {boolean|null} [set] UpdateEquinoxSAC set
         */
    
        /**
         * Constructs a new UpdateEquinoxSAC.
         * @exports UpdateEquinoxSAC
         * @classdesc Represents an UpdateEquinoxSAC.
         * @implements IUpdateEquinoxSAC
         * @constructor
         * @param {IUpdateEquinoxSAC=} [properties] Properties to set
         */
        function UpdateEquinoxSAC(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * UpdateEquinoxSAC set.
         * @member {boolean} set
         * @memberof UpdateEquinoxSAC
         * @instance
         */
        UpdateEquinoxSAC.prototype.set = false;
    
        /**
         * Creates a new UpdateEquinoxSAC instance using the specified properties.
         * @function create
         * @memberof UpdateEquinoxSAC
         * @static
         * @param {IUpdateEquinoxSAC=} [properties] Properties to set
         * @returns {UpdateEquinoxSAC} UpdateEquinoxSAC instance
         */
        UpdateEquinoxSAC.create = function create(properties) {
            return new UpdateEquinoxSAC(properties);
        };
    
        /**
         * Encodes the specified UpdateEquinoxSAC message. Does not implicitly {@link UpdateEquinoxSAC.verify|verify} messages.
         * @function encode
         * @memberof UpdateEquinoxSAC
         * @static
         * @param {IUpdateEquinoxSAC} message UpdateEquinoxSAC message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateEquinoxSAC.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.set != null && message.hasOwnProperty("set"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.set);
            return writer;
        };
    
        /**
         * Encodes the specified UpdateEquinoxSAC message, length delimited. Does not implicitly {@link UpdateEquinoxSAC.verify|verify} messages.
         * @function encodeDelimited
         * @memberof UpdateEquinoxSAC
         * @static
         * @param {IUpdateEquinoxSAC} message UpdateEquinoxSAC message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateEquinoxSAC.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an UpdateEquinoxSAC message from the specified reader or buffer.
         * @function decode
         * @memberof UpdateEquinoxSAC
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {UpdateEquinoxSAC} UpdateEquinoxSAC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateEquinoxSAC.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UpdateEquinoxSAC();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.set = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an UpdateEquinoxSAC message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof UpdateEquinoxSAC
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {UpdateEquinoxSAC} UpdateEquinoxSAC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateEquinoxSAC.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an UpdateEquinoxSAC message.
         * @function verify
         * @memberof UpdateEquinoxSAC
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateEquinoxSAC.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.set != null && message.hasOwnProperty("set"))
                if (typeof message.set !== "boolean")
                    return "set: boolean expected";
            return null;
        };
    
        /**
         * Creates an UpdateEquinoxSAC message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof UpdateEquinoxSAC
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {UpdateEquinoxSAC} UpdateEquinoxSAC
         */
        UpdateEquinoxSAC.fromObject = function fromObject(object) {
            if (object instanceof $root.UpdateEquinoxSAC)
                return object;
            var message = new $root.UpdateEquinoxSAC();
            if (object.set != null)
                message.set = Boolean(object.set);
            return message;
        };
    
        /**
         * Creates a plain object from an UpdateEquinoxSAC message. Also converts values to other types if specified.
         * @function toObject
         * @memberof UpdateEquinoxSAC
         * @static
         * @param {UpdateEquinoxSAC} message UpdateEquinoxSAC
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateEquinoxSAC.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.set = false;
            if (message.set != null && message.hasOwnProperty("set"))
                object.set = message.set;
            return object;
        };
    
        /**
         * Converts this UpdateEquinoxSAC to JSON.
         * @function toJSON
         * @memberof UpdateEquinoxSAC
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateEquinoxSAC.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return UpdateEquinoxSAC;
    })();
    
    $root.UpdateEquinoxFwdU = (function() {
    
        /**
         * Properties of an UpdateEquinoxFwdU.
         * @exports IUpdateEquinoxFwdU
         * @interface IUpdateEquinoxFwdU
         * @property {boolean|null} [set] UpdateEquinoxFwdU set
         * @property {string|null} [fwduNumber] UpdateEquinoxFwdU fwduNumber
         */
    
        /**
         * Constructs a new UpdateEquinoxFwdU.
         * @exports UpdateEquinoxFwdU
         * @classdesc Represents an UpdateEquinoxFwdU.
         * @implements IUpdateEquinoxFwdU
         * @constructor
         * @param {IUpdateEquinoxFwdU=} [properties] Properties to set
         */
        function UpdateEquinoxFwdU(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * UpdateEquinoxFwdU set.
         * @member {boolean} set
         * @memberof UpdateEquinoxFwdU
         * @instance
         */
        UpdateEquinoxFwdU.prototype.set = false;
    
        /**
         * UpdateEquinoxFwdU fwduNumber.
         * @member {string} fwduNumber
         * @memberof UpdateEquinoxFwdU
         * @instance
         */
        UpdateEquinoxFwdU.prototype.fwduNumber = "";
    
        /**
         * Creates a new UpdateEquinoxFwdU instance using the specified properties.
         * @function create
         * @memberof UpdateEquinoxFwdU
         * @static
         * @param {IUpdateEquinoxFwdU=} [properties] Properties to set
         * @returns {UpdateEquinoxFwdU} UpdateEquinoxFwdU instance
         */
        UpdateEquinoxFwdU.create = function create(properties) {
            return new UpdateEquinoxFwdU(properties);
        };
    
        /**
         * Encodes the specified UpdateEquinoxFwdU message. Does not implicitly {@link UpdateEquinoxFwdU.verify|verify} messages.
         * @function encode
         * @memberof UpdateEquinoxFwdU
         * @static
         * @param {IUpdateEquinoxFwdU} message UpdateEquinoxFwdU message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateEquinoxFwdU.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.set != null && message.hasOwnProperty("set"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.set);
            if (message.fwduNumber != null && message.hasOwnProperty("fwduNumber"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.fwduNumber);
            return writer;
        };
    
        /**
         * Encodes the specified UpdateEquinoxFwdU message, length delimited. Does not implicitly {@link UpdateEquinoxFwdU.verify|verify} messages.
         * @function encodeDelimited
         * @memberof UpdateEquinoxFwdU
         * @static
         * @param {IUpdateEquinoxFwdU} message UpdateEquinoxFwdU message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateEquinoxFwdU.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an UpdateEquinoxFwdU message from the specified reader or buffer.
         * @function decode
         * @memberof UpdateEquinoxFwdU
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {UpdateEquinoxFwdU} UpdateEquinoxFwdU
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateEquinoxFwdU.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UpdateEquinoxFwdU();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.set = reader.bool();
                    break;
                case 2:
                    message.fwduNumber = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an UpdateEquinoxFwdU message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof UpdateEquinoxFwdU
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {UpdateEquinoxFwdU} UpdateEquinoxFwdU
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateEquinoxFwdU.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an UpdateEquinoxFwdU message.
         * @function verify
         * @memberof UpdateEquinoxFwdU
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateEquinoxFwdU.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.set != null && message.hasOwnProperty("set"))
                if (typeof message.set !== "boolean")
                    return "set: boolean expected";
            if (message.fwduNumber != null && message.hasOwnProperty("fwduNumber"))
                if (!$util.isString(message.fwduNumber))
                    return "fwduNumber: string expected";
            return null;
        };
    
        /**
         * Creates an UpdateEquinoxFwdU message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof UpdateEquinoxFwdU
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {UpdateEquinoxFwdU} UpdateEquinoxFwdU
         */
        UpdateEquinoxFwdU.fromObject = function fromObject(object) {
            if (object instanceof $root.UpdateEquinoxFwdU)
                return object;
            var message = new $root.UpdateEquinoxFwdU();
            if (object.set != null)
                message.set = Boolean(object.set);
            if (object.fwduNumber != null)
                message.fwduNumber = String(object.fwduNumber);
            return message;
        };
    
        /**
         * Creates a plain object from an UpdateEquinoxFwdU message. Also converts values to other types if specified.
         * @function toObject
         * @memberof UpdateEquinoxFwdU
         * @static
         * @param {UpdateEquinoxFwdU} message UpdateEquinoxFwdU
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateEquinoxFwdU.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.set = false;
                object.fwduNumber = "";
            }
            if (message.set != null && message.hasOwnProperty("set"))
                object.set = message.set;
            if (message.fwduNumber != null && message.hasOwnProperty("fwduNumber"))
                object.fwduNumber = message.fwduNumber;
            return object;
        };
    
        /**
         * Converts this UpdateEquinoxFwdU to JSON.
         * @function toJSON
         * @memberof UpdateEquinoxFwdU
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateEquinoxFwdU.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return UpdateEquinoxFwdU;
    })();
    
    $root.UpdateEquinoxLock = (function() {
    
        /**
         * Properties of an UpdateEquinoxLock.
         * @exports IUpdateEquinoxLock
         * @interface IUpdateEquinoxLock
         * @property {boolean|null} [lock] UpdateEquinoxLock lock
         * @property {boolean|null} [unlock] UpdateEquinoxLock unlock
         * @property {string|null} [unlockcode] UpdateEquinoxLock unlockcode
         */
    
        /**
         * Constructs a new UpdateEquinoxLock.
         * @exports UpdateEquinoxLock
         * @classdesc Represents an UpdateEquinoxLock.
         * @implements IUpdateEquinoxLock
         * @constructor
         * @param {IUpdateEquinoxLock=} [properties] Properties to set
         */
        function UpdateEquinoxLock(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * UpdateEquinoxLock lock.
         * @member {boolean} lock
         * @memberof UpdateEquinoxLock
         * @instance
         */
        UpdateEquinoxLock.prototype.lock = false;
    
        /**
         * UpdateEquinoxLock unlock.
         * @member {boolean} unlock
         * @memberof UpdateEquinoxLock
         * @instance
         */
        UpdateEquinoxLock.prototype.unlock = false;
    
        /**
         * UpdateEquinoxLock unlockcode.
         * @member {string} unlockcode
         * @memberof UpdateEquinoxLock
         * @instance
         */
        UpdateEquinoxLock.prototype.unlockcode = "";
    
        /**
         * Creates a new UpdateEquinoxLock instance using the specified properties.
         * @function create
         * @memberof UpdateEquinoxLock
         * @static
         * @param {IUpdateEquinoxLock=} [properties] Properties to set
         * @returns {UpdateEquinoxLock} UpdateEquinoxLock instance
         */
        UpdateEquinoxLock.create = function create(properties) {
            return new UpdateEquinoxLock(properties);
        };
    
        /**
         * Encodes the specified UpdateEquinoxLock message. Does not implicitly {@link UpdateEquinoxLock.verify|verify} messages.
         * @function encode
         * @memberof UpdateEquinoxLock
         * @static
         * @param {IUpdateEquinoxLock} message UpdateEquinoxLock message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateEquinoxLock.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.lock != null && message.hasOwnProperty("lock"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.lock);
            if (message.unlock != null && message.hasOwnProperty("unlock"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.unlock);
            if (message.unlockcode != null && message.hasOwnProperty("unlockcode"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.unlockcode);
            return writer;
        };
    
        /**
         * Encodes the specified UpdateEquinoxLock message, length delimited. Does not implicitly {@link UpdateEquinoxLock.verify|verify} messages.
         * @function encodeDelimited
         * @memberof UpdateEquinoxLock
         * @static
         * @param {IUpdateEquinoxLock} message UpdateEquinoxLock message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateEquinoxLock.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an UpdateEquinoxLock message from the specified reader or buffer.
         * @function decode
         * @memberof UpdateEquinoxLock
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {UpdateEquinoxLock} UpdateEquinoxLock
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateEquinoxLock.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UpdateEquinoxLock();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.lock = reader.bool();
                    break;
                case 2:
                    message.unlock = reader.bool();
                    break;
                case 3:
                    message.unlockcode = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an UpdateEquinoxLock message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof UpdateEquinoxLock
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {UpdateEquinoxLock} UpdateEquinoxLock
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateEquinoxLock.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an UpdateEquinoxLock message.
         * @function verify
         * @memberof UpdateEquinoxLock
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateEquinoxLock.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.lock != null && message.hasOwnProperty("lock"))
                if (typeof message.lock !== "boolean")
                    return "lock: boolean expected";
            if (message.unlock != null && message.hasOwnProperty("unlock"))
                if (typeof message.unlock !== "boolean")
                    return "unlock: boolean expected";
            if (message.unlockcode != null && message.hasOwnProperty("unlockcode"))
                if (!$util.isString(message.unlockcode))
                    return "unlockcode: string expected";
            return null;
        };
    
        /**
         * Creates an UpdateEquinoxLock message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof UpdateEquinoxLock
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {UpdateEquinoxLock} UpdateEquinoxLock
         */
        UpdateEquinoxLock.fromObject = function fromObject(object) {
            if (object instanceof $root.UpdateEquinoxLock)
                return object;
            var message = new $root.UpdateEquinoxLock();
            if (object.lock != null)
                message.lock = Boolean(object.lock);
            if (object.unlock != null)
                message.unlock = Boolean(object.unlock);
            if (object.unlockcode != null)
                message.unlockcode = String(object.unlockcode);
            return message;
        };
    
        /**
         * Creates a plain object from an UpdateEquinoxLock message. Also converts values to other types if specified.
         * @function toObject
         * @memberof UpdateEquinoxLock
         * @static
         * @param {UpdateEquinoxLock} message UpdateEquinoxLock
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateEquinoxLock.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.lock = false;
                object.unlock = false;
                object.unlockcode = "";
            }
            if (message.lock != null && message.hasOwnProperty("lock"))
                object.lock = message.lock;
            if (message.unlock != null && message.hasOwnProperty("unlock"))
                object.unlock = message.unlock;
            if (message.unlockcode != null && message.hasOwnProperty("unlockcode"))
                object.unlockcode = message.unlockcode;
            return object;
        };
    
        /**
         * Converts this UpdateEquinoxLock to JSON.
         * @function toJSON
         * @memberof UpdateEquinoxLock
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateEquinoxLock.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return UpdateEquinoxLock;
    })();
    
    $root.UpdateEquinoxAbsence = (function() {
    
        /**
         * Properties of an UpdateEquinoxAbsence.
         * @exports IUpdateEquinoxAbsence
         * @interface IUpdateEquinoxAbsence
         * @property {number|null} [set] UpdateEquinoxAbsence set
         * @property {IAbsence|null} [absence] UpdateEquinoxAbsence absence
         */
    
        /**
         * Constructs a new UpdateEquinoxAbsence.
         * @exports UpdateEquinoxAbsence
         * @classdesc Represents an UpdateEquinoxAbsence.
         * @implements IUpdateEquinoxAbsence
         * @constructor
         * @param {IUpdateEquinoxAbsence=} [properties] Properties to set
         */
        function UpdateEquinoxAbsence(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * UpdateEquinoxAbsence set.
         * @member {number} set
         * @memberof UpdateEquinoxAbsence
         * @instance
         */
        UpdateEquinoxAbsence.prototype.set = 0;
    
        /**
         * UpdateEquinoxAbsence absence.
         * @member {IAbsence|null|undefined} absence
         * @memberof UpdateEquinoxAbsence
         * @instance
         */
        UpdateEquinoxAbsence.prototype.absence = null;
    
        /**
         * Creates a new UpdateEquinoxAbsence instance using the specified properties.
         * @function create
         * @memberof UpdateEquinoxAbsence
         * @static
         * @param {IUpdateEquinoxAbsence=} [properties] Properties to set
         * @returns {UpdateEquinoxAbsence} UpdateEquinoxAbsence instance
         */
        UpdateEquinoxAbsence.create = function create(properties) {
            return new UpdateEquinoxAbsence(properties);
        };
    
        /**
         * Encodes the specified UpdateEquinoxAbsence message. Does not implicitly {@link UpdateEquinoxAbsence.verify|verify} messages.
         * @function encode
         * @memberof UpdateEquinoxAbsence
         * @static
         * @param {IUpdateEquinoxAbsence} message UpdateEquinoxAbsence message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateEquinoxAbsence.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.set != null && message.hasOwnProperty("set"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.set);
            if (message.absence != null && message.hasOwnProperty("absence"))
                $root.Absence.encode(message.absence, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified UpdateEquinoxAbsence message, length delimited. Does not implicitly {@link UpdateEquinoxAbsence.verify|verify} messages.
         * @function encodeDelimited
         * @memberof UpdateEquinoxAbsence
         * @static
         * @param {IUpdateEquinoxAbsence} message UpdateEquinoxAbsence message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateEquinoxAbsence.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an UpdateEquinoxAbsence message from the specified reader or buffer.
         * @function decode
         * @memberof UpdateEquinoxAbsence
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {UpdateEquinoxAbsence} UpdateEquinoxAbsence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateEquinoxAbsence.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UpdateEquinoxAbsence();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.set = reader.int32();
                    break;
                case 2:
                    message.absence = $root.Absence.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an UpdateEquinoxAbsence message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof UpdateEquinoxAbsence
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {UpdateEquinoxAbsence} UpdateEquinoxAbsence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateEquinoxAbsence.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an UpdateEquinoxAbsence message.
         * @function verify
         * @memberof UpdateEquinoxAbsence
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateEquinoxAbsence.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.set != null && message.hasOwnProperty("set"))
                if (!$util.isInteger(message.set))
                    return "set: integer expected";
            if (message.absence != null && message.hasOwnProperty("absence")) {
                var error = $root.Absence.verify(message.absence);
                if (error)
                    return "absence." + error;
            }
            return null;
        };
    
        /**
         * Creates an UpdateEquinoxAbsence message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof UpdateEquinoxAbsence
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {UpdateEquinoxAbsence} UpdateEquinoxAbsence
         */
        UpdateEquinoxAbsence.fromObject = function fromObject(object) {
            if (object instanceof $root.UpdateEquinoxAbsence)
                return object;
            var message = new $root.UpdateEquinoxAbsence();
            if (object.set != null)
                message.set = object.set | 0;
            if (object.absence != null) {
                if (typeof object.absence !== "object")
                    throw TypeError(".UpdateEquinoxAbsence.absence: object expected");
                message.absence = $root.Absence.fromObject(object.absence);
            }
            return message;
        };
    
        /**
         * Creates a plain object from an UpdateEquinoxAbsence message. Also converts values to other types if specified.
         * @function toObject
         * @memberof UpdateEquinoxAbsence
         * @static
         * @param {UpdateEquinoxAbsence} message UpdateEquinoxAbsence
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateEquinoxAbsence.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.set = 0;
                object.absence = null;
            }
            if (message.set != null && message.hasOwnProperty("set"))
                object.set = message.set;
            if (message.absence != null && message.hasOwnProperty("absence"))
                object.absence = $root.Absence.toObject(message.absence, options);
            return object;
        };
    
        /**
         * Converts this UpdateEquinoxAbsence to JSON.
         * @function toJSON
         * @memberof UpdateEquinoxAbsence
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateEquinoxAbsence.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return UpdateEquinoxAbsence;
    })();
    
    $root.UpdateEquinoxEC500 = (function() {
    
        /**
         * Properties of an UpdateEquinoxEC500.
         * @exports IUpdateEquinoxEC500
         * @interface IUpdateEquinoxEC500
         * @property {boolean|null} [set] UpdateEquinoxEC500 set
         */
    
        /**
         * Constructs a new UpdateEquinoxEC500.
         * @exports UpdateEquinoxEC500
         * @classdesc Represents an UpdateEquinoxEC500.
         * @implements IUpdateEquinoxEC500
         * @constructor
         * @param {IUpdateEquinoxEC500=} [properties] Properties to set
         */
        function UpdateEquinoxEC500(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * UpdateEquinoxEC500 set.
         * @member {boolean} set
         * @memberof UpdateEquinoxEC500
         * @instance
         */
        UpdateEquinoxEC500.prototype.set = false;
    
        /**
         * Creates a new UpdateEquinoxEC500 instance using the specified properties.
         * @function create
         * @memberof UpdateEquinoxEC500
         * @static
         * @param {IUpdateEquinoxEC500=} [properties] Properties to set
         * @returns {UpdateEquinoxEC500} UpdateEquinoxEC500 instance
         */
        UpdateEquinoxEC500.create = function create(properties) {
            return new UpdateEquinoxEC500(properties);
        };
    
        /**
         * Encodes the specified UpdateEquinoxEC500 message. Does not implicitly {@link UpdateEquinoxEC500.verify|verify} messages.
         * @function encode
         * @memberof UpdateEquinoxEC500
         * @static
         * @param {IUpdateEquinoxEC500} message UpdateEquinoxEC500 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateEquinoxEC500.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.set != null && message.hasOwnProperty("set"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.set);
            return writer;
        };
    
        /**
         * Encodes the specified UpdateEquinoxEC500 message, length delimited. Does not implicitly {@link UpdateEquinoxEC500.verify|verify} messages.
         * @function encodeDelimited
         * @memberof UpdateEquinoxEC500
         * @static
         * @param {IUpdateEquinoxEC500} message UpdateEquinoxEC500 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateEquinoxEC500.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an UpdateEquinoxEC500 message from the specified reader or buffer.
         * @function decode
         * @memberof UpdateEquinoxEC500
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {UpdateEquinoxEC500} UpdateEquinoxEC500
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateEquinoxEC500.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UpdateEquinoxEC500();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.set = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an UpdateEquinoxEC500 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof UpdateEquinoxEC500
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {UpdateEquinoxEC500} UpdateEquinoxEC500
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateEquinoxEC500.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an UpdateEquinoxEC500 message.
         * @function verify
         * @memberof UpdateEquinoxEC500
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateEquinoxEC500.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.set != null && message.hasOwnProperty("set"))
                if (typeof message.set !== "boolean")
                    return "set: boolean expected";
            return null;
        };
    
        /**
         * Creates an UpdateEquinoxEC500 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof UpdateEquinoxEC500
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {UpdateEquinoxEC500} UpdateEquinoxEC500
         */
        UpdateEquinoxEC500.fromObject = function fromObject(object) {
            if (object instanceof $root.UpdateEquinoxEC500)
                return object;
            var message = new $root.UpdateEquinoxEC500();
            if (object.set != null)
                message.set = Boolean(object.set);
            return message;
        };
    
        /**
         * Creates a plain object from an UpdateEquinoxEC500 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof UpdateEquinoxEC500
         * @static
         * @param {UpdateEquinoxEC500} message UpdateEquinoxEC500
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateEquinoxEC500.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.set = false;
            if (message.set != null && message.hasOwnProperty("set"))
                object.set = message.set;
            return object;
        };
    
        /**
         * Converts this UpdateEquinoxEC500 to JSON.
         * @function toJSON
         * @memberof UpdateEquinoxEC500
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateEquinoxEC500.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return UpdateEquinoxEC500;
    })();
    
    $root.UpdateEquinoxApp = (function() {
    
        /**
         * Properties of an UpdateEquinoxApp.
         * @exports IUpdateEquinoxApp
         * @interface IUpdateEquinoxApp
         * @property {string|null} [value] UpdateEquinoxApp value
         */
    
        /**
         * Constructs a new UpdateEquinoxApp.
         * @exports UpdateEquinoxApp
         * @classdesc Represents an UpdateEquinoxApp.
         * @implements IUpdateEquinoxApp
         * @constructor
         * @param {IUpdateEquinoxApp=} [properties] Properties to set
         */
        function UpdateEquinoxApp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * UpdateEquinoxApp value.
         * @member {string} value
         * @memberof UpdateEquinoxApp
         * @instance
         */
        UpdateEquinoxApp.prototype.value = "";
    
        /**
         * Creates a new UpdateEquinoxApp instance using the specified properties.
         * @function create
         * @memberof UpdateEquinoxApp
         * @static
         * @param {IUpdateEquinoxApp=} [properties] Properties to set
         * @returns {UpdateEquinoxApp} UpdateEquinoxApp instance
         */
        UpdateEquinoxApp.create = function create(properties) {
            return new UpdateEquinoxApp(properties);
        };
    
        /**
         * Encodes the specified UpdateEquinoxApp message. Does not implicitly {@link UpdateEquinoxApp.verify|verify} messages.
         * @function encode
         * @memberof UpdateEquinoxApp
         * @static
         * @param {IUpdateEquinoxApp} message UpdateEquinoxApp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateEquinoxApp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.value != null && message.hasOwnProperty("value"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
            return writer;
        };
    
        /**
         * Encodes the specified UpdateEquinoxApp message, length delimited. Does not implicitly {@link UpdateEquinoxApp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof UpdateEquinoxApp
         * @static
         * @param {IUpdateEquinoxApp} message UpdateEquinoxApp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateEquinoxApp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an UpdateEquinoxApp message from the specified reader or buffer.
         * @function decode
         * @memberof UpdateEquinoxApp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {UpdateEquinoxApp} UpdateEquinoxApp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateEquinoxApp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UpdateEquinoxApp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.value = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an UpdateEquinoxApp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof UpdateEquinoxApp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {UpdateEquinoxApp} UpdateEquinoxApp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateEquinoxApp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an UpdateEquinoxApp message.
         * @function verify
         * @memberof UpdateEquinoxApp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateEquinoxApp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (!$util.isString(message.value))
                    return "value: string expected";
            return null;
        };
    
        /**
         * Creates an UpdateEquinoxApp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof UpdateEquinoxApp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {UpdateEquinoxApp} UpdateEquinoxApp
         */
        UpdateEquinoxApp.fromObject = function fromObject(object) {
            if (object instanceof $root.UpdateEquinoxApp)
                return object;
            var message = new $root.UpdateEquinoxApp();
            if (object.value != null)
                message.value = String(object.value);
            return message;
        };
    
        /**
         * Creates a plain object from an UpdateEquinoxApp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof UpdateEquinoxApp
         * @static
         * @param {UpdateEquinoxApp} message UpdateEquinoxApp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateEquinoxApp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.value = "";
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = message.value;
            return object;
        };
    
        /**
         * Converts this UpdateEquinoxApp to JSON.
         * @function toJSON
         * @memberof UpdateEquinoxApp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateEquinoxApp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return UpdateEquinoxApp;
    })();
    
    $root.UpdateEquinoxSelf = (function() {
    
        /**
         * Properties of an UpdateEquinoxSelf.
         * @exports IUpdateEquinoxSelf
         * @interface IUpdateEquinoxSelf
         * @property {IUpdateEquinoxSAC|null} [sac] UpdateEquinoxSelf sac
         * @property {IUpdateEquinoxAbsence|null} [absence] UpdateEquinoxSelf absence
         * @property {IUpdateEquinoxEC500|null} [ec500] UpdateEquinoxSelf ec500
         * @property {IUpdateEquinoxApp|null} [app] UpdateEquinoxSelf app
         * @property {Array.<IShortCodeData>|null} [shortcodedata] UpdateEquinoxSelf shortcodedata
         * @property {IUpdateEquinoxFwdU|null} [fwdu] UpdateEquinoxSelf fwdu
         * @property {IUpdateEquinoxLock|null} [lock] UpdateEquinoxSelf lock
         */
    
        /**
         * Constructs a new UpdateEquinoxSelf.
         * @exports UpdateEquinoxSelf
         * @classdesc Represents an UpdateEquinoxSelf.
         * @implements IUpdateEquinoxSelf
         * @constructor
         * @param {IUpdateEquinoxSelf=} [properties] Properties to set
         */
        function UpdateEquinoxSelf(properties) {
            this.shortcodedata = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * UpdateEquinoxSelf sac.
         * @member {IUpdateEquinoxSAC|null|undefined} sac
         * @memberof UpdateEquinoxSelf
         * @instance
         */
        UpdateEquinoxSelf.prototype.sac = null;
    
        /**
         * UpdateEquinoxSelf absence.
         * @member {IUpdateEquinoxAbsence|null|undefined} absence
         * @memberof UpdateEquinoxSelf
         * @instance
         */
        UpdateEquinoxSelf.prototype.absence = null;
    
        /**
         * UpdateEquinoxSelf ec500.
         * @member {IUpdateEquinoxEC500|null|undefined} ec500
         * @memberof UpdateEquinoxSelf
         * @instance
         */
        UpdateEquinoxSelf.prototype.ec500 = null;
    
        /**
         * UpdateEquinoxSelf app.
         * @member {IUpdateEquinoxApp|null|undefined} app
         * @memberof UpdateEquinoxSelf
         * @instance
         */
        UpdateEquinoxSelf.prototype.app = null;
    
        /**
         * UpdateEquinoxSelf shortcodedata.
         * @member {Array.<IShortCodeData>} shortcodedata
         * @memberof UpdateEquinoxSelf
         * @instance
         */
        UpdateEquinoxSelf.prototype.shortcodedata = $util.emptyArray;
    
        /**
         * UpdateEquinoxSelf fwdu.
         * @member {IUpdateEquinoxFwdU|null|undefined} fwdu
         * @memberof UpdateEquinoxSelf
         * @instance
         */
        UpdateEquinoxSelf.prototype.fwdu = null;
    
        /**
         * UpdateEquinoxSelf lock.
         * @member {IUpdateEquinoxLock|null|undefined} lock
         * @memberof UpdateEquinoxSelf
         * @instance
         */
        UpdateEquinoxSelf.prototype.lock = null;
    
        /**
         * Creates a new UpdateEquinoxSelf instance using the specified properties.
         * @function create
         * @memberof UpdateEquinoxSelf
         * @static
         * @param {IUpdateEquinoxSelf=} [properties] Properties to set
         * @returns {UpdateEquinoxSelf} UpdateEquinoxSelf instance
         */
        UpdateEquinoxSelf.create = function create(properties) {
            return new UpdateEquinoxSelf(properties);
        };
    
        /**
         * Encodes the specified UpdateEquinoxSelf message. Does not implicitly {@link UpdateEquinoxSelf.verify|verify} messages.
         * @function encode
         * @memberof UpdateEquinoxSelf
         * @static
         * @param {IUpdateEquinoxSelf} message UpdateEquinoxSelf message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateEquinoxSelf.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sac != null && message.hasOwnProperty("sac"))
                $root.UpdateEquinoxSAC.encode(message.sac, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.absence != null && message.hasOwnProperty("absence"))
                $root.UpdateEquinoxAbsence.encode(message.absence, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.ec500 != null && message.hasOwnProperty("ec500"))
                $root.UpdateEquinoxEC500.encode(message.ec500, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.app != null && message.hasOwnProperty("app"))
                $root.UpdateEquinoxApp.encode(message.app, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.shortcodedata != null && message.shortcodedata.length)
                for (var i = 0; i < message.shortcodedata.length; ++i)
                    $root.ShortCodeData.encode(message.shortcodedata[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.fwdu != null && message.hasOwnProperty("fwdu"))
                $root.UpdateEquinoxFwdU.encode(message.fwdu, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.lock != null && message.hasOwnProperty("lock"))
                $root.UpdateEquinoxLock.encode(message.lock, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified UpdateEquinoxSelf message, length delimited. Does not implicitly {@link UpdateEquinoxSelf.verify|verify} messages.
         * @function encodeDelimited
         * @memberof UpdateEquinoxSelf
         * @static
         * @param {IUpdateEquinoxSelf} message UpdateEquinoxSelf message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateEquinoxSelf.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an UpdateEquinoxSelf message from the specified reader or buffer.
         * @function decode
         * @memberof UpdateEquinoxSelf
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {UpdateEquinoxSelf} UpdateEquinoxSelf
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateEquinoxSelf.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UpdateEquinoxSelf();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sac = $root.UpdateEquinoxSAC.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.absence = $root.UpdateEquinoxAbsence.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.ec500 = $root.UpdateEquinoxEC500.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.app = $root.UpdateEquinoxApp.decode(reader, reader.uint32());
                    break;
                case 5:
                    if (!(message.shortcodedata && message.shortcodedata.length))
                        message.shortcodedata = [];
                    message.shortcodedata.push($root.ShortCodeData.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.fwdu = $root.UpdateEquinoxFwdU.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.lock = $root.UpdateEquinoxLock.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an UpdateEquinoxSelf message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof UpdateEquinoxSelf
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {UpdateEquinoxSelf} UpdateEquinoxSelf
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateEquinoxSelf.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an UpdateEquinoxSelf message.
         * @function verify
         * @memberof UpdateEquinoxSelf
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateEquinoxSelf.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sac != null && message.hasOwnProperty("sac")) {
                var error = $root.UpdateEquinoxSAC.verify(message.sac);
                if (error)
                    return "sac." + error;
            }
            if (message.absence != null && message.hasOwnProperty("absence")) {
                var error = $root.UpdateEquinoxAbsence.verify(message.absence);
                if (error)
                    return "absence." + error;
            }
            if (message.ec500 != null && message.hasOwnProperty("ec500")) {
                var error = $root.UpdateEquinoxEC500.verify(message.ec500);
                if (error)
                    return "ec500." + error;
            }
            if (message.app != null && message.hasOwnProperty("app")) {
                var error = $root.UpdateEquinoxApp.verify(message.app);
                if (error)
                    return "app." + error;
            }
            if (message.shortcodedata != null && message.hasOwnProperty("shortcodedata")) {
                if (!Array.isArray(message.shortcodedata))
                    return "shortcodedata: array expected";
                for (var i = 0; i < message.shortcodedata.length; ++i) {
                    var error = $root.ShortCodeData.verify(message.shortcodedata[i]);
                    if (error)
                        return "shortcodedata." + error;
                }
            }
            if (message.fwdu != null && message.hasOwnProperty("fwdu")) {
                var error = $root.UpdateEquinoxFwdU.verify(message.fwdu);
                if (error)
                    return "fwdu." + error;
            }
            if (message.lock != null && message.hasOwnProperty("lock")) {
                var error = $root.UpdateEquinoxLock.verify(message.lock);
                if (error)
                    return "lock." + error;
            }
            return null;
        };
    
        /**
         * Creates an UpdateEquinoxSelf message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof UpdateEquinoxSelf
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {UpdateEquinoxSelf} UpdateEquinoxSelf
         */
        UpdateEquinoxSelf.fromObject = function fromObject(object) {
            if (object instanceof $root.UpdateEquinoxSelf)
                return object;
            var message = new $root.UpdateEquinoxSelf();
            if (object.sac != null) {
                if (typeof object.sac !== "object")
                    throw TypeError(".UpdateEquinoxSelf.sac: object expected");
                message.sac = $root.UpdateEquinoxSAC.fromObject(object.sac);
            }
            if (object.absence != null) {
                if (typeof object.absence !== "object")
                    throw TypeError(".UpdateEquinoxSelf.absence: object expected");
                message.absence = $root.UpdateEquinoxAbsence.fromObject(object.absence);
            }
            if (object.ec500 != null) {
                if (typeof object.ec500 !== "object")
                    throw TypeError(".UpdateEquinoxSelf.ec500: object expected");
                message.ec500 = $root.UpdateEquinoxEC500.fromObject(object.ec500);
            }
            if (object.app != null) {
                if (typeof object.app !== "object")
                    throw TypeError(".UpdateEquinoxSelf.app: object expected");
                message.app = $root.UpdateEquinoxApp.fromObject(object.app);
            }
            if (object.shortcodedata) {
                if (!Array.isArray(object.shortcodedata))
                    throw TypeError(".UpdateEquinoxSelf.shortcodedata: array expected");
                message.shortcodedata = [];
                for (var i = 0; i < object.shortcodedata.length; ++i) {
                    if (typeof object.shortcodedata[i] !== "object")
                        throw TypeError(".UpdateEquinoxSelf.shortcodedata: object expected");
                    message.shortcodedata[i] = $root.ShortCodeData.fromObject(object.shortcodedata[i]);
                }
            }
            if (object.fwdu != null) {
                if (typeof object.fwdu !== "object")
                    throw TypeError(".UpdateEquinoxSelf.fwdu: object expected");
                message.fwdu = $root.UpdateEquinoxFwdU.fromObject(object.fwdu);
            }
            if (object.lock != null) {
                if (typeof object.lock !== "object")
                    throw TypeError(".UpdateEquinoxSelf.lock: object expected");
                message.lock = $root.UpdateEquinoxLock.fromObject(object.lock);
            }
            return message;
        };
    
        /**
         * Creates a plain object from an UpdateEquinoxSelf message. Also converts values to other types if specified.
         * @function toObject
         * @memberof UpdateEquinoxSelf
         * @static
         * @param {UpdateEquinoxSelf} message UpdateEquinoxSelf
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateEquinoxSelf.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.shortcodedata = [];
            if (options.defaults) {
                object.sac = null;
                object.absence = null;
                object.ec500 = null;
                object.app = null;
                object.fwdu = null;
                object.lock = null;
            }
            if (message.sac != null && message.hasOwnProperty("sac"))
                object.sac = $root.UpdateEquinoxSAC.toObject(message.sac, options);
            if (message.absence != null && message.hasOwnProperty("absence"))
                object.absence = $root.UpdateEquinoxAbsence.toObject(message.absence, options);
            if (message.ec500 != null && message.hasOwnProperty("ec500"))
                object.ec500 = $root.UpdateEquinoxEC500.toObject(message.ec500, options);
            if (message.app != null && message.hasOwnProperty("app"))
                object.app = $root.UpdateEquinoxApp.toObject(message.app, options);
            if (message.shortcodedata && message.shortcodedata.length) {
                object.shortcodedata = [];
                for (var j = 0; j < message.shortcodedata.length; ++j)
                    object.shortcodedata[j] = $root.ShortCodeData.toObject(message.shortcodedata[j], options);
            }
            if (message.fwdu != null && message.hasOwnProperty("fwdu"))
                object.fwdu = $root.UpdateEquinoxFwdU.toObject(message.fwdu, options);
            if (message.lock != null && message.hasOwnProperty("lock"))
                object.lock = $root.UpdateEquinoxLock.toObject(message.lock, options);
            return object;
        };
    
        /**
         * Converts this UpdateEquinoxSelf to JSON.
         * @function toJSON
         * @memberof UpdateEquinoxSelf
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateEquinoxSelf.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return UpdateEquinoxSelf;
    })();
    
    $root.NotifyEquinoxSelf = (function() {
    
        /**
         * Properties of a NotifyEquinoxSelf.
         * @exports INotifyEquinoxSelf
         * @interface INotifyEquinoxSelf
         * @property {number|null} [featuresavailable] NotifyEquinoxSelf featuresavailable
         * @property {boolean|null} [sac] NotifyEquinoxSelf sac
         * @property {number|null} [phonestate] NotifyEquinoxSelf phonestate
         * @property {IAbsence|null} [absence] NotifyEquinoxSelf absence
         * @property {number|null} [ec500] NotifyEquinoxSelf ec500
         * @property {string|null} [app] NotifyEquinoxSelf app
         * @property {string|null} [presentity] NotifyEquinoxSelf presentity
         * @property {boolean|null} [fwdu] NotifyEquinoxSelf fwdu
         * @property {string|null} [fwduNumber] NotifyEquinoxSelf fwduNumber
         * @property {boolean|null} [locked] NotifyEquinoxSelf locked
         * @property {IFwdInfo|null} [fwdinfo] NotifyEquinoxSelf fwdinfo
         * @property {number|null} [vmunreadMessages] NotifyEquinoxSelf vmunreadMessages
         * @property {boolean|null} [ccdesk] NotifyEquinoxSelf ccdesk
         * @property {boolean|null} [ccsoftphone] NotifyEquinoxSelf ccsoftphone
         * @property {boolean|null} [ccmobile] NotifyEquinoxSelf ccmobile
         * @property {boolean|null} [ccteleworker] NotifyEquinoxSelf ccteleworker
         * @property {boolean|null} [cclogindesk] NotifyEquinoxSelf cclogindesk
         * @property {boolean|null} [ccwebrtc] NotifyEquinoxSelf ccwebrtc
         */
    
        /**
         * Constructs a new NotifyEquinoxSelf.
         * @exports NotifyEquinoxSelf
         * @classdesc Represents a NotifyEquinoxSelf.
         * @implements INotifyEquinoxSelf
         * @constructor
         * @param {INotifyEquinoxSelf=} [properties] Properties to set
         */
        function NotifyEquinoxSelf(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * NotifyEquinoxSelf featuresavailable.
         * @member {number} featuresavailable
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.featuresavailable = 0;
    
        /**
         * NotifyEquinoxSelf sac.
         * @member {boolean} sac
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.sac = false;
    
        /**
         * NotifyEquinoxSelf phonestate.
         * @member {number} phonestate
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.phonestate = 0;
    
        /**
         * NotifyEquinoxSelf absence.
         * @member {IAbsence|null|undefined} absence
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.absence = null;
    
        /**
         * NotifyEquinoxSelf ec500.
         * @member {number} ec500
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.ec500 = 0;
    
        /**
         * NotifyEquinoxSelf app.
         * @member {string} app
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.app = "";
    
        /**
         * NotifyEquinoxSelf presentity.
         * @member {string} presentity
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.presentity = "";
    
        /**
         * NotifyEquinoxSelf fwdu.
         * @member {boolean} fwdu
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.fwdu = false;
    
        /**
         * NotifyEquinoxSelf fwduNumber.
         * @member {string} fwduNumber
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.fwduNumber = "";
    
        /**
         * NotifyEquinoxSelf locked.
         * @member {boolean} locked
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.locked = false;
    
        /**
         * NotifyEquinoxSelf fwdinfo.
         * @member {IFwdInfo|null|undefined} fwdinfo
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.fwdinfo = null;
    
        /**
         * NotifyEquinoxSelf vmunreadMessages.
         * @member {number} vmunreadMessages
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.vmunreadMessages = 0;
    
        /**
         * NotifyEquinoxSelf ccdesk.
         * @member {boolean} ccdesk
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.ccdesk = false;
    
        /**
         * NotifyEquinoxSelf ccsoftphone.
         * @member {boolean} ccsoftphone
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.ccsoftphone = false;
    
        /**
         * NotifyEquinoxSelf ccmobile.
         * @member {boolean} ccmobile
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.ccmobile = false;
    
        /**
         * NotifyEquinoxSelf ccteleworker.
         * @member {boolean} ccteleworker
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.ccteleworker = false;
    
        /**
         * NotifyEquinoxSelf cclogindesk.
         * @member {boolean} cclogindesk
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.cclogindesk = false;
    
        /**
         * NotifyEquinoxSelf ccwebrtc.
         * @member {boolean} ccwebrtc
         * @memberof NotifyEquinoxSelf
         * @instance
         */
        NotifyEquinoxSelf.prototype.ccwebrtc = false;
    
        /**
         * Creates a new NotifyEquinoxSelf instance using the specified properties.
         * @function create
         * @memberof NotifyEquinoxSelf
         * @static
         * @param {INotifyEquinoxSelf=} [properties] Properties to set
         * @returns {NotifyEquinoxSelf} NotifyEquinoxSelf instance
         */
        NotifyEquinoxSelf.create = function create(properties) {
            return new NotifyEquinoxSelf(properties);
        };
    
        /**
         * Encodes the specified NotifyEquinoxSelf message. Does not implicitly {@link NotifyEquinoxSelf.verify|verify} messages.
         * @function encode
         * @memberof NotifyEquinoxSelf
         * @static
         * @param {INotifyEquinoxSelf} message NotifyEquinoxSelf message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyEquinoxSelf.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.featuresavailable != null && message.hasOwnProperty("featuresavailable"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.featuresavailable);
            if (message.sac != null && message.hasOwnProperty("sac"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.sac);
            if (message.phonestate != null && message.hasOwnProperty("phonestate"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.phonestate);
            if (message.absence != null && message.hasOwnProperty("absence"))
                $root.Absence.encode(message.absence, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.ec500 != null && message.hasOwnProperty("ec500"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.ec500);
            if (message.app != null && message.hasOwnProperty("app"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.app);
            if (message.presentity != null && message.hasOwnProperty("presentity"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.presentity);
            if (message.fwdu != null && message.hasOwnProperty("fwdu"))
                writer.uint32(/* id 8, wireType 0 =*/64).bool(message.fwdu);
            if (message.fwduNumber != null && message.hasOwnProperty("fwduNumber"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.fwduNumber);
            if (message.locked != null && message.hasOwnProperty("locked"))
                writer.uint32(/* id 10, wireType 0 =*/80).bool(message.locked);
            if (message.fwdinfo != null && message.hasOwnProperty("fwdinfo"))
                $root.FwdInfo.encode(message.fwdinfo, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.vmunreadMessages != null && message.hasOwnProperty("vmunreadMessages"))
                writer.uint32(/* id 12, wireType 0 =*/96).int32(message.vmunreadMessages);
            if (message.ccdesk != null && message.hasOwnProperty("ccdesk"))
                writer.uint32(/* id 30, wireType 0 =*/240).bool(message.ccdesk);
            if (message.ccsoftphone != null && message.hasOwnProperty("ccsoftphone"))
                writer.uint32(/* id 31, wireType 0 =*/248).bool(message.ccsoftphone);
            if (message.ccmobile != null && message.hasOwnProperty("ccmobile"))
                writer.uint32(/* id 32, wireType 0 =*/256).bool(message.ccmobile);
            if (message.ccteleworker != null && message.hasOwnProperty("ccteleworker"))
                writer.uint32(/* id 33, wireType 0 =*/264).bool(message.ccteleworker);
            if (message.cclogindesk != null && message.hasOwnProperty("cclogindesk"))
                writer.uint32(/* id 34, wireType 0 =*/272).bool(message.cclogindesk);
            if (message.ccwebrtc != null && message.hasOwnProperty("ccwebrtc"))
                writer.uint32(/* id 35, wireType 0 =*/280).bool(message.ccwebrtc);
            return writer;
        };
    
        /**
         * Encodes the specified NotifyEquinoxSelf message, length delimited. Does not implicitly {@link NotifyEquinoxSelf.verify|verify} messages.
         * @function encodeDelimited
         * @memberof NotifyEquinoxSelf
         * @static
         * @param {INotifyEquinoxSelf} message NotifyEquinoxSelf message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyEquinoxSelf.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a NotifyEquinoxSelf message from the specified reader or buffer.
         * @function decode
         * @memberof NotifyEquinoxSelf
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {NotifyEquinoxSelf} NotifyEquinoxSelf
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyEquinoxSelf.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NotifyEquinoxSelf();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.featuresavailable = reader.int32();
                    break;
                case 2:
                    message.sac = reader.bool();
                    break;
                case 3:
                    message.phonestate = reader.int32();
                    break;
                case 4:
                    message.absence = $root.Absence.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.ec500 = reader.int32();
                    break;
                case 6:
                    message.app = reader.string();
                    break;
                case 7:
                    message.presentity = reader.string();
                    break;
                case 8:
                    message.fwdu = reader.bool();
                    break;
                case 9:
                    message.fwduNumber = reader.string();
                    break;
                case 10:
                    message.locked = reader.bool();
                    break;
                case 11:
                    message.fwdinfo = $root.FwdInfo.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.vmunreadMessages = reader.int32();
                    break;
                case 30:
                    message.ccdesk = reader.bool();
                    break;
                case 31:
                    message.ccsoftphone = reader.bool();
                    break;
                case 32:
                    message.ccmobile = reader.bool();
                    break;
                case 33:
                    message.ccteleworker = reader.bool();
                    break;
                case 34:
                    message.cclogindesk = reader.bool();
                    break;
                case 35:
                    message.ccwebrtc = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a NotifyEquinoxSelf message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof NotifyEquinoxSelf
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {NotifyEquinoxSelf} NotifyEquinoxSelf
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyEquinoxSelf.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a NotifyEquinoxSelf message.
         * @function verify
         * @memberof NotifyEquinoxSelf
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NotifyEquinoxSelf.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.featuresavailable != null && message.hasOwnProperty("featuresavailable"))
                if (!$util.isInteger(message.featuresavailable))
                    return "featuresavailable: integer expected";
            if (message.sac != null && message.hasOwnProperty("sac"))
                if (typeof message.sac !== "boolean")
                    return "sac: boolean expected";
            if (message.phonestate != null && message.hasOwnProperty("phonestate"))
                if (!$util.isInteger(message.phonestate))
                    return "phonestate: integer expected";
            if (message.absence != null && message.hasOwnProperty("absence")) {
                var error = $root.Absence.verify(message.absence);
                if (error)
                    return "absence." + error;
            }
            if (message.ec500 != null && message.hasOwnProperty("ec500"))
                if (!$util.isInteger(message.ec500))
                    return "ec500: integer expected";
            if (message.app != null && message.hasOwnProperty("app"))
                if (!$util.isString(message.app))
                    return "app: string expected";
            if (message.presentity != null && message.hasOwnProperty("presentity"))
                if (!$util.isString(message.presentity))
                    return "presentity: string expected";
            if (message.fwdu != null && message.hasOwnProperty("fwdu"))
                if (typeof message.fwdu !== "boolean")
                    return "fwdu: boolean expected";
            if (message.fwduNumber != null && message.hasOwnProperty("fwduNumber"))
                if (!$util.isString(message.fwduNumber))
                    return "fwduNumber: string expected";
            if (message.locked != null && message.hasOwnProperty("locked"))
                if (typeof message.locked !== "boolean")
                    return "locked: boolean expected";
            if (message.fwdinfo != null && message.hasOwnProperty("fwdinfo")) {
                var error = $root.FwdInfo.verify(message.fwdinfo);
                if (error)
                    return "fwdinfo." + error;
            }
            if (message.vmunreadMessages != null && message.hasOwnProperty("vmunreadMessages"))
                if (!$util.isInteger(message.vmunreadMessages))
                    return "vmunreadMessages: integer expected";
            if (message.ccdesk != null && message.hasOwnProperty("ccdesk"))
                if (typeof message.ccdesk !== "boolean")
                    return "ccdesk: boolean expected";
            if (message.ccsoftphone != null && message.hasOwnProperty("ccsoftphone"))
                if (typeof message.ccsoftphone !== "boolean")
                    return "ccsoftphone: boolean expected";
            if (message.ccmobile != null && message.hasOwnProperty("ccmobile"))
                if (typeof message.ccmobile !== "boolean")
                    return "ccmobile: boolean expected";
            if (message.ccteleworker != null && message.hasOwnProperty("ccteleworker"))
                if (typeof message.ccteleworker !== "boolean")
                    return "ccteleworker: boolean expected";
            if (message.cclogindesk != null && message.hasOwnProperty("cclogindesk"))
                if (typeof message.cclogindesk !== "boolean")
                    return "cclogindesk: boolean expected";
            if (message.ccwebrtc != null && message.hasOwnProperty("ccwebrtc"))
                if (typeof message.ccwebrtc !== "boolean")
                    return "ccwebrtc: boolean expected";
            return null;
        };
    
        /**
         * Creates a NotifyEquinoxSelf message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof NotifyEquinoxSelf
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {NotifyEquinoxSelf} NotifyEquinoxSelf
         */
        NotifyEquinoxSelf.fromObject = function fromObject(object) {
            if (object instanceof $root.NotifyEquinoxSelf)
                return object;
            var message = new $root.NotifyEquinoxSelf();
            if (object.featuresavailable != null)
                message.featuresavailable = object.featuresavailable | 0;
            if (object.sac != null)
                message.sac = Boolean(object.sac);
            if (object.phonestate != null)
                message.phonestate = object.phonestate | 0;
            if (object.absence != null) {
                if (typeof object.absence !== "object")
                    throw TypeError(".NotifyEquinoxSelf.absence: object expected");
                message.absence = $root.Absence.fromObject(object.absence);
            }
            if (object.ec500 != null)
                message.ec500 = object.ec500 | 0;
            if (object.app != null)
                message.app = String(object.app);
            if (object.presentity != null)
                message.presentity = String(object.presentity);
            if (object.fwdu != null)
                message.fwdu = Boolean(object.fwdu);
            if (object.fwduNumber != null)
                message.fwduNumber = String(object.fwduNumber);
            if (object.locked != null)
                message.locked = Boolean(object.locked);
            if (object.fwdinfo != null) {
                if (typeof object.fwdinfo !== "object")
                    throw TypeError(".NotifyEquinoxSelf.fwdinfo: object expected");
                message.fwdinfo = $root.FwdInfo.fromObject(object.fwdinfo);
            }
            if (object.vmunreadMessages != null)
                message.vmunreadMessages = object.vmunreadMessages | 0;
            if (object.ccdesk != null)
                message.ccdesk = Boolean(object.ccdesk);
            if (object.ccsoftphone != null)
                message.ccsoftphone = Boolean(object.ccsoftphone);
            if (object.ccmobile != null)
                message.ccmobile = Boolean(object.ccmobile);
            if (object.ccteleworker != null)
                message.ccteleworker = Boolean(object.ccteleworker);
            if (object.cclogindesk != null)
                message.cclogindesk = Boolean(object.cclogindesk);
            if (object.ccwebrtc != null)
                message.ccwebrtc = Boolean(object.ccwebrtc);
            return message;
        };
    
        /**
         * Creates a plain object from a NotifyEquinoxSelf message. Also converts values to other types if specified.
         * @function toObject
         * @memberof NotifyEquinoxSelf
         * @static
         * @param {NotifyEquinoxSelf} message NotifyEquinoxSelf
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NotifyEquinoxSelf.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.featuresavailable = 0;
                object.sac = false;
                object.phonestate = 0;
                object.absence = null;
                object.ec500 = 0;
                object.app = "";
                object.presentity = "";
                object.fwdu = false;
                object.fwduNumber = "";
                object.locked = false;
                object.fwdinfo = null;
                object.vmunreadMessages = 0;
                object.ccdesk = false;
                object.ccsoftphone = false;
                object.ccmobile = false;
                object.ccteleworker = false;
                object.cclogindesk = false;
                object.ccwebrtc = false;
            }
            if (message.featuresavailable != null && message.hasOwnProperty("featuresavailable"))
                object.featuresavailable = message.featuresavailable;
            if (message.sac != null && message.hasOwnProperty("sac"))
                object.sac = message.sac;
            if (message.phonestate != null && message.hasOwnProperty("phonestate"))
                object.phonestate = message.phonestate;
            if (message.absence != null && message.hasOwnProperty("absence"))
                object.absence = $root.Absence.toObject(message.absence, options);
            if (message.ec500 != null && message.hasOwnProperty("ec500"))
                object.ec500 = message.ec500;
            if (message.app != null && message.hasOwnProperty("app"))
                object.app = message.app;
            if (message.presentity != null && message.hasOwnProperty("presentity"))
                object.presentity = message.presentity;
            if (message.fwdu != null && message.hasOwnProperty("fwdu"))
                object.fwdu = message.fwdu;
            if (message.fwduNumber != null && message.hasOwnProperty("fwduNumber"))
                object.fwduNumber = message.fwduNumber;
            if (message.locked != null && message.hasOwnProperty("locked"))
                object.locked = message.locked;
            if (message.fwdinfo != null && message.hasOwnProperty("fwdinfo"))
                object.fwdinfo = $root.FwdInfo.toObject(message.fwdinfo, options);
            if (message.vmunreadMessages != null && message.hasOwnProperty("vmunreadMessages"))
                object.vmunreadMessages = message.vmunreadMessages;
            if (message.ccdesk != null && message.hasOwnProperty("ccdesk"))
                object.ccdesk = message.ccdesk;
            if (message.ccsoftphone != null && message.hasOwnProperty("ccsoftphone"))
                object.ccsoftphone = message.ccsoftphone;
            if (message.ccmobile != null && message.hasOwnProperty("ccmobile"))
                object.ccmobile = message.ccmobile;
            if (message.ccteleworker != null && message.hasOwnProperty("ccteleworker"))
                object.ccteleworker = message.ccteleworker;
            if (message.cclogindesk != null && message.hasOwnProperty("cclogindesk"))
                object.cclogindesk = message.cclogindesk;
            if (message.ccwebrtc != null && message.hasOwnProperty("ccwebrtc"))
                object.ccwebrtc = message.ccwebrtc;
            return object;
        };
    
        /**
         * Converts this NotifyEquinoxSelf to JSON.
         * @function toJSON
         * @memberof NotifyEquinoxSelf
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NotifyEquinoxSelf.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return NotifyEquinoxSelf;
    })();
    
    $root.SubscribeEquinoxSelf = (function() {
    
        /**
         * Properties of a SubscribeEquinoxSelf.
         * @exports ISubscribeEquinoxSelf
         * @interface ISubscribeEquinoxSelf
         * @property {number|null} [flags] SubscribeEquinoxSelf flags
         */
    
        /**
         * Constructs a new SubscribeEquinoxSelf.
         * @exports SubscribeEquinoxSelf
         * @classdesc Represents a SubscribeEquinoxSelf.
         * @implements ISubscribeEquinoxSelf
         * @constructor
         * @param {ISubscribeEquinoxSelf=} [properties] Properties to set
         */
        function SubscribeEquinoxSelf(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * SubscribeEquinoxSelf flags.
         * @member {number} flags
         * @memberof SubscribeEquinoxSelf
         * @instance
         */
        SubscribeEquinoxSelf.prototype.flags = 0;
    
        /**
         * Creates a new SubscribeEquinoxSelf instance using the specified properties.
         * @function create
         * @memberof SubscribeEquinoxSelf
         * @static
         * @param {ISubscribeEquinoxSelf=} [properties] Properties to set
         * @returns {SubscribeEquinoxSelf} SubscribeEquinoxSelf instance
         */
        SubscribeEquinoxSelf.create = function create(properties) {
            return new SubscribeEquinoxSelf(properties);
        };
    
        /**
         * Encodes the specified SubscribeEquinoxSelf message. Does not implicitly {@link SubscribeEquinoxSelf.verify|verify} messages.
         * @function encode
         * @memberof SubscribeEquinoxSelf
         * @static
         * @param {ISubscribeEquinoxSelf} message SubscribeEquinoxSelf message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubscribeEquinoxSelf.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.flags != null && message.hasOwnProperty("flags"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.flags);
            return writer;
        };
    
        /**
         * Encodes the specified SubscribeEquinoxSelf message, length delimited. Does not implicitly {@link SubscribeEquinoxSelf.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SubscribeEquinoxSelf
         * @static
         * @param {ISubscribeEquinoxSelf} message SubscribeEquinoxSelf message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubscribeEquinoxSelf.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a SubscribeEquinoxSelf message from the specified reader or buffer.
         * @function decode
         * @memberof SubscribeEquinoxSelf
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SubscribeEquinoxSelf} SubscribeEquinoxSelf
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubscribeEquinoxSelf.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SubscribeEquinoxSelf();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.flags = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a SubscribeEquinoxSelf message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SubscribeEquinoxSelf
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SubscribeEquinoxSelf} SubscribeEquinoxSelf
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubscribeEquinoxSelf.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a SubscribeEquinoxSelf message.
         * @function verify
         * @memberof SubscribeEquinoxSelf
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SubscribeEquinoxSelf.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.flags != null && message.hasOwnProperty("flags"))
                if (!$util.isInteger(message.flags))
                    return "flags: integer expected";
            return null;
        };
    
        /**
         * Creates a SubscribeEquinoxSelf message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SubscribeEquinoxSelf
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SubscribeEquinoxSelf} SubscribeEquinoxSelf
         */
        SubscribeEquinoxSelf.fromObject = function fromObject(object) {
            if (object instanceof $root.SubscribeEquinoxSelf)
                return object;
            var message = new $root.SubscribeEquinoxSelf();
            if (object.flags != null)
                message.flags = object.flags | 0;
            return message;
        };
    
        /**
         * Creates a plain object from a SubscribeEquinoxSelf message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SubscribeEquinoxSelf
         * @static
         * @param {SubscribeEquinoxSelf} message SubscribeEquinoxSelf
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SubscribeEquinoxSelf.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.flags = 0;
            if (message.flags != null && message.hasOwnProperty("flags"))
                object.flags = message.flags;
            return object;
        };
    
        /**
         * Converts this SubscribeEquinoxSelf to JSON.
         * @function toJSON
         * @memberof SubscribeEquinoxSelf
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SubscribeEquinoxSelf.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return SubscribeEquinoxSelf;
    })();
    
    $root.UpdateEquinoxPresence = (function() {
    
        /**
         * Properties of an UpdateEquinoxPresence.
         * @exports IUpdateEquinoxPresence
         * @interface IUpdateEquinoxPresence
         * @property {Array.<IEquinoxPresentity>|null} [add] UpdateEquinoxPresence add
         * @property {Array.<IEquinoxPresentity>|null} [remove] UpdateEquinoxPresence remove
         */
    
        /**
         * Constructs a new UpdateEquinoxPresence.
         * @exports UpdateEquinoxPresence
         * @classdesc Represents an UpdateEquinoxPresence.
         * @implements IUpdateEquinoxPresence
         * @constructor
         * @param {IUpdateEquinoxPresence=} [properties] Properties to set
         */
        function UpdateEquinoxPresence(properties) {
            this.add = [];
            this.remove = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * UpdateEquinoxPresence add.
         * @member {Array.<IEquinoxPresentity>} add
         * @memberof UpdateEquinoxPresence
         * @instance
         */
        UpdateEquinoxPresence.prototype.add = $util.emptyArray;
    
        /**
         * UpdateEquinoxPresence remove.
         * @member {Array.<IEquinoxPresentity>} remove
         * @memberof UpdateEquinoxPresence
         * @instance
         */
        UpdateEquinoxPresence.prototype.remove = $util.emptyArray;
    
        /**
         * Creates a new UpdateEquinoxPresence instance using the specified properties.
         * @function create
         * @memberof UpdateEquinoxPresence
         * @static
         * @param {IUpdateEquinoxPresence=} [properties] Properties to set
         * @returns {UpdateEquinoxPresence} UpdateEquinoxPresence instance
         */
        UpdateEquinoxPresence.create = function create(properties) {
            return new UpdateEquinoxPresence(properties);
        };
    
        /**
         * Encodes the specified UpdateEquinoxPresence message. Does not implicitly {@link UpdateEquinoxPresence.verify|verify} messages.
         * @function encode
         * @memberof UpdateEquinoxPresence
         * @static
         * @param {IUpdateEquinoxPresence} message UpdateEquinoxPresence message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateEquinoxPresence.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.add != null && message.add.length)
                for (var i = 0; i < message.add.length; ++i)
                    $root.EquinoxPresentity.encode(message.add[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.remove != null && message.remove.length)
                for (var i = 0; i < message.remove.length; ++i)
                    $root.EquinoxPresentity.encode(message.remove[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified UpdateEquinoxPresence message, length delimited. Does not implicitly {@link UpdateEquinoxPresence.verify|verify} messages.
         * @function encodeDelimited
         * @memberof UpdateEquinoxPresence
         * @static
         * @param {IUpdateEquinoxPresence} message UpdateEquinoxPresence message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateEquinoxPresence.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an UpdateEquinoxPresence message from the specified reader or buffer.
         * @function decode
         * @memberof UpdateEquinoxPresence
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {UpdateEquinoxPresence} UpdateEquinoxPresence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateEquinoxPresence.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UpdateEquinoxPresence();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.add && message.add.length))
                        message.add = [];
                    message.add.push($root.EquinoxPresentity.decode(reader, reader.uint32()));
                    break;
                case 2:
                    if (!(message.remove && message.remove.length))
                        message.remove = [];
                    message.remove.push($root.EquinoxPresentity.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an UpdateEquinoxPresence message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof UpdateEquinoxPresence
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {UpdateEquinoxPresence} UpdateEquinoxPresence
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateEquinoxPresence.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an UpdateEquinoxPresence message.
         * @function verify
         * @memberof UpdateEquinoxPresence
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateEquinoxPresence.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.add != null && message.hasOwnProperty("add")) {
                if (!Array.isArray(message.add))
                    return "add: array expected";
                for (var i = 0; i < message.add.length; ++i) {
                    var error = $root.EquinoxPresentity.verify(message.add[i]);
                    if (error)
                        return "add." + error;
                }
            }
            if (message.remove != null && message.hasOwnProperty("remove")) {
                if (!Array.isArray(message.remove))
                    return "remove: array expected";
                for (var i = 0; i < message.remove.length; ++i) {
                    var error = $root.EquinoxPresentity.verify(message.remove[i]);
                    if (error)
                        return "remove." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates an UpdateEquinoxPresence message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof UpdateEquinoxPresence
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {UpdateEquinoxPresence} UpdateEquinoxPresence
         */
        UpdateEquinoxPresence.fromObject = function fromObject(object) {
            if (object instanceof $root.UpdateEquinoxPresence)
                return object;
            var message = new $root.UpdateEquinoxPresence();
            if (object.add) {
                if (!Array.isArray(object.add))
                    throw TypeError(".UpdateEquinoxPresence.add: array expected");
                message.add = [];
                for (var i = 0; i < object.add.length; ++i) {
                    if (typeof object.add[i] !== "object")
                        throw TypeError(".UpdateEquinoxPresence.add: object expected");
                    message.add[i] = $root.EquinoxPresentity.fromObject(object.add[i]);
                }
            }
            if (object.remove) {
                if (!Array.isArray(object.remove))
                    throw TypeError(".UpdateEquinoxPresence.remove: array expected");
                message.remove = [];
                for (var i = 0; i < object.remove.length; ++i) {
                    if (typeof object.remove[i] !== "object")
                        throw TypeError(".UpdateEquinoxPresence.remove: object expected");
                    message.remove[i] = $root.EquinoxPresentity.fromObject(object.remove[i]);
                }
            }
            return message;
        };
    
        /**
         * Creates a plain object from an UpdateEquinoxPresence message. Also converts values to other types if specified.
         * @function toObject
         * @memberof UpdateEquinoxPresence
         * @static
         * @param {UpdateEquinoxPresence} message UpdateEquinoxPresence
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateEquinoxPresence.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.add = [];
                object.remove = [];
            }
            if (message.add && message.add.length) {
                object.add = [];
                for (var j = 0; j < message.add.length; ++j)
                    object.add[j] = $root.EquinoxPresentity.toObject(message.add[j], options);
            }
            if (message.remove && message.remove.length) {
                object.remove = [];
                for (var j = 0; j < message.remove.length; ++j)
                    object.remove[j] = $root.EquinoxPresentity.toObject(message.remove[j], options);
            }
            return object;
        };
    
        /**
         * Converts this UpdateEquinoxPresence to JSON.
         * @function toJSON
         * @memberof UpdateEquinoxPresence
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateEquinoxPresence.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return UpdateEquinoxPresence;
    })();
    
    $root.Contact = (function() {
    
        /**
         * Properties of a Contact.
         * @exports IContact
         * @interface IContact
         * @property {string|null} [firstname] Contact firstname
         * @property {string|null} [lastname] Contact lastname
         * @property {number|null} [lref] Contact lref
         * @property {string|null} [number] Contact number
         * @property {number|null} [favourite] Contact favourite
         * @property {string|null} [email] Contact email
         * @property {string|null} [image] Contact image
         */
    
        /**
         * Constructs a new Contact.
         * @exports Contact
         * @classdesc Represents a Contact.
         * @implements IContact
         * @constructor
         * @param {IContact=} [properties] Properties to set
         */
        function Contact(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * Contact firstname.
         * @member {string} firstname
         * @memberof Contact
         * @instance
         */
        Contact.prototype.firstname = "";
    
        /**
         * Contact lastname.
         * @member {string} lastname
         * @memberof Contact
         * @instance
         */
        Contact.prototype.lastname = "";
    
        /**
         * Contact lref.
         * @member {number} lref
         * @memberof Contact
         * @instance
         */
        Contact.prototype.lref = 0;
    
        /**
         * Contact number.
         * @member {string} number
         * @memberof Contact
         * @instance
         */
        Contact.prototype.number = "";
    
        /**
         * Contact favourite.
         * @member {number} favourite
         * @memberof Contact
         * @instance
         */
        Contact.prototype.favourite = 0;
    
        /**
         * Contact email.
         * @member {string} email
         * @memberof Contact
         * @instance
         */
        Contact.prototype.email = "";
    
        /**
         * Contact image.
         * @member {string} image
         * @memberof Contact
         * @instance
         */
        Contact.prototype.image = "";
    
        /**
         * Creates a new Contact instance using the specified properties.
         * @function create
         * @memberof Contact
         * @static
         * @param {IContact=} [properties] Properties to set
         * @returns {Contact} Contact instance
         */
        Contact.create = function create(properties) {
            return new Contact(properties);
        };
    
        /**
         * Encodes the specified Contact message. Does not implicitly {@link Contact.verify|verify} messages.
         * @function encode
         * @memberof Contact
         * @static
         * @param {IContact} message Contact message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Contact.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.firstname != null && message.hasOwnProperty("firstname"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.firstname);
            if (message.lastname != null && message.hasOwnProperty("lastname"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.lastname);
            if (message.lref != null && message.hasOwnProperty("lref"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.lref);
            if (message.number != null && message.hasOwnProperty("number"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.number);
            if (message.favourite != null && message.hasOwnProperty("favourite"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.favourite);
            if (message.email != null && message.hasOwnProperty("email"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.email);
            if (message.image != null && message.hasOwnProperty("image"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.image);
            return writer;
        };
    
        /**
         * Encodes the specified Contact message, length delimited. Does not implicitly {@link Contact.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Contact
         * @static
         * @param {IContact} message Contact message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Contact.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a Contact message from the specified reader or buffer.
         * @function decode
         * @memberof Contact
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Contact} Contact
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Contact.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Contact();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.firstname = reader.string();
                    break;
                case 2:
                    message.lastname = reader.string();
                    break;
                case 3:
                    message.lref = reader.int32();
                    break;
                case 4:
                    message.number = reader.string();
                    break;
                case 5:
                    message.favourite = reader.int32();
                    break;
                case 6:
                    message.email = reader.string();
                    break;
                case 7:
                    message.image = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a Contact message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Contact
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Contact} Contact
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Contact.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a Contact message.
         * @function verify
         * @memberof Contact
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Contact.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.firstname != null && message.hasOwnProperty("firstname"))
                if (!$util.isString(message.firstname))
                    return "firstname: string expected";
            if (message.lastname != null && message.hasOwnProperty("lastname"))
                if (!$util.isString(message.lastname))
                    return "lastname: string expected";
            if (message.lref != null && message.hasOwnProperty("lref"))
                if (!$util.isInteger(message.lref))
                    return "lref: integer expected";
            if (message.number != null && message.hasOwnProperty("number"))
                if (!$util.isString(message.number))
                    return "number: string expected";
            if (message.favourite != null && message.hasOwnProperty("favourite"))
                if (!$util.isInteger(message.favourite))
                    return "favourite: integer expected";
            if (message.email != null && message.hasOwnProperty("email"))
                if (!$util.isString(message.email))
                    return "email: string expected";
            if (message.image != null && message.hasOwnProperty("image"))
                if (!$util.isString(message.image))
                    return "image: string expected";
            return null;
        };
    
        /**
         * Creates a Contact message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Contact
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Contact} Contact
         */
        Contact.fromObject = function fromObject(object) {
            if (object instanceof $root.Contact)
                return object;
            var message = new $root.Contact();
            if (object.firstname != null)
                message.firstname = String(object.firstname);
            if (object.lastname != null)
                message.lastname = String(object.lastname);
            if (object.lref != null)
                message.lref = object.lref | 0;
            if (object.number != null)
                message.number = String(object.number);
            if (object.favourite != null)
                message.favourite = object.favourite | 0;
            if (object.email != null)
                message.email = String(object.email);
            if (object.image != null)
                message.image = String(object.image);
            return message;
        };
    
        /**
         * Creates a plain object from a Contact message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Contact
         * @static
         * @param {Contact} message Contact
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Contact.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.firstname = "";
                object.lastname = "";
                object.lref = 0;
                object.number = "";
                object.favourite = 0;
                object.email = "";
                object.image = "";
            }
            if (message.firstname != null && message.hasOwnProperty("firstname"))
                object.firstname = message.firstname;
            if (message.lastname != null && message.hasOwnProperty("lastname"))
                object.lastname = message.lastname;
            if (message.lref != null && message.hasOwnProperty("lref"))
                object.lref = message.lref;
            if (message.number != null && message.hasOwnProperty("number"))
                object.number = message.number;
            if (message.favourite != null && message.hasOwnProperty("favourite"))
                object.favourite = message.favourite;
            if (message.email != null && message.hasOwnProperty("email"))
                object.email = message.email;
            if (message.image != null && message.hasOwnProperty("image"))
                object.image = message.image;
            return object;
        };
    
        /**
         * Converts this Contact to JSON.
         * @function toJSON
         * @memberof Contact
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Contact.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return Contact;
    })();
    
    $root.ListContacts = (function() {
    
        /**
         * Properties of a ListContacts.
         * @exports IListContacts
         * @interface IListContacts
         * @property {Array.<IContact>|null} [entryList] ListContacts entryList
         */
    
        /**
         * Constructs a new ListContacts.
         * @exports ListContacts
         * @classdesc Represents a ListContacts.
         * @implements IListContacts
         * @constructor
         * @param {IListContacts=} [properties] Properties to set
         */
        function ListContacts(properties) {
            this.entryList = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * ListContacts entryList.
         * @member {Array.<IContact>} entryList
         * @memberof ListContacts
         * @instance
         */
        ListContacts.prototype.entryList = $util.emptyArray;
    
        /**
         * Creates a new ListContacts instance using the specified properties.
         * @function create
         * @memberof ListContacts
         * @static
         * @param {IListContacts=} [properties] Properties to set
         * @returns {ListContacts} ListContacts instance
         */
        ListContacts.create = function create(properties) {
            return new ListContacts(properties);
        };
    
        /**
         * Encodes the specified ListContacts message. Does not implicitly {@link ListContacts.verify|verify} messages.
         * @function encode
         * @memberof ListContacts
         * @static
         * @param {IListContacts} message ListContacts message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ListContacts.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.entryList != null && message.entryList.length)
                for (var i = 0; i < message.entryList.length; ++i)
                    $root.Contact.encode(message.entryList[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified ListContacts message, length delimited. Does not implicitly {@link ListContacts.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ListContacts
         * @static
         * @param {IListContacts} message ListContacts message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ListContacts.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a ListContacts message from the specified reader or buffer.
         * @function decode
         * @memberof ListContacts
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ListContacts} ListContacts
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ListContacts.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ListContacts();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.entryList && message.entryList.length))
                        message.entryList = [];
                    message.entryList.push($root.Contact.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a ListContacts message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ListContacts
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ListContacts} ListContacts
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ListContacts.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a ListContacts message.
         * @function verify
         * @memberof ListContacts
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ListContacts.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.entryList != null && message.hasOwnProperty("entryList")) {
                if (!Array.isArray(message.entryList))
                    return "entryList: array expected";
                for (var i = 0; i < message.entryList.length; ++i) {
                    var error = $root.Contact.verify(message.entryList[i]);
                    if (error)
                        return "entryList." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a ListContacts message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ListContacts
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ListContacts} ListContacts
         */
        ListContacts.fromObject = function fromObject(object) {
            if (object instanceof $root.ListContacts)
                return object;
            var message = new $root.ListContacts();
            if (object.entryList) {
                if (!Array.isArray(object.entryList))
                    throw TypeError(".ListContacts.entryList: array expected");
                message.entryList = [];
                for (var i = 0; i < object.entryList.length; ++i) {
                    if (typeof object.entryList[i] !== "object")
                        throw TypeError(".ListContacts.entryList: object expected");
                    message.entryList[i] = $root.Contact.fromObject(object.entryList[i]);
                }
            }
            return message;
        };
    
        /**
         * Creates a plain object from a ListContacts message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ListContacts
         * @static
         * @param {ListContacts} message ListContacts
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ListContacts.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.entryList = [];
            if (message.entryList && message.entryList.length) {
                object.entryList = [];
                for (var j = 0; j < message.entryList.length; ++j)
                    object.entryList[j] = $root.Contact.toObject(message.entryList[j], options);
            }
            return object;
        };
    
        /**
         * Converts this ListContacts to JSON.
         * @function toJSON
         * @memberof ListContacts
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ListContacts.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return ListContacts;
    })();
    
    $root.NotifyContacts = (function() {
    
        /**
         * Properties of a NotifyContacts.
         * @exports INotifyContacts
         * @interface INotifyContacts
         * @property {number|null} [head] NotifyContacts head
         * @property {IListContacts|null} [full] NotifyContacts full
         * @property {IListContacts|null} [changed] NotifyContacts changed
         * @property {IListContacts|null} [removed] NotifyContacts removed
         * @property {IContact|null} [selfcontact] NotifyContacts selfcontact
         */
    
        /**
         * Constructs a new NotifyContacts.
         * @exports NotifyContacts
         * @classdesc Represents a NotifyContacts.
         * @implements INotifyContacts
         * @constructor
         * @param {INotifyContacts=} [properties] Properties to set
         */
        function NotifyContacts(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * NotifyContacts head.
         * @member {number} head
         * @memberof NotifyContacts
         * @instance
         */
        NotifyContacts.prototype.head = 0;
    
        /**
         * NotifyContacts full.
         * @member {IListContacts|null|undefined} full
         * @memberof NotifyContacts
         * @instance
         */
        NotifyContacts.prototype.full = null;
    
        /**
         * NotifyContacts changed.
         * @member {IListContacts|null|undefined} changed
         * @memberof NotifyContacts
         * @instance
         */
        NotifyContacts.prototype.changed = null;
    
        /**
         * NotifyContacts removed.
         * @member {IListContacts|null|undefined} removed
         * @memberof NotifyContacts
         * @instance
         */
        NotifyContacts.prototype.removed = null;
    
        /**
         * NotifyContacts selfcontact.
         * @member {IContact|null|undefined} selfcontact
         * @memberof NotifyContacts
         * @instance
         */
        NotifyContacts.prototype.selfcontact = null;
    
        /**
         * Creates a new NotifyContacts instance using the specified properties.
         * @function create
         * @memberof NotifyContacts
         * @static
         * @param {INotifyContacts=} [properties] Properties to set
         * @returns {NotifyContacts} NotifyContacts instance
         */
        NotifyContacts.create = function create(properties) {
            return new NotifyContacts(properties);
        };
    
        /**
         * Encodes the specified NotifyContacts message. Does not implicitly {@link NotifyContacts.verify|verify} messages.
         * @function encode
         * @memberof NotifyContacts
         * @static
         * @param {INotifyContacts} message NotifyContacts message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyContacts.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.head != null && message.hasOwnProperty("head"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.head);
            if (message.full != null && message.hasOwnProperty("full"))
                $root.ListContacts.encode(message.full, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.changed != null && message.hasOwnProperty("changed"))
                $root.ListContacts.encode(message.changed, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.removed != null && message.hasOwnProperty("removed"))
                $root.ListContacts.encode(message.removed, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.selfcontact != null && message.hasOwnProperty("selfcontact"))
                $root.Contact.encode(message.selfcontact, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified NotifyContacts message, length delimited. Does not implicitly {@link NotifyContacts.verify|verify} messages.
         * @function encodeDelimited
         * @memberof NotifyContacts
         * @static
         * @param {INotifyContacts} message NotifyContacts message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyContacts.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a NotifyContacts message from the specified reader or buffer.
         * @function decode
         * @memberof NotifyContacts
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {NotifyContacts} NotifyContacts
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyContacts.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NotifyContacts();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.head = reader.int32();
                    break;
                case 2:
                    message.full = $root.ListContacts.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.changed = $root.ListContacts.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.removed = $root.ListContacts.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.selfcontact = $root.Contact.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a NotifyContacts message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof NotifyContacts
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {NotifyContacts} NotifyContacts
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyContacts.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a NotifyContacts message.
         * @function verify
         * @memberof NotifyContacts
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NotifyContacts.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.head != null && message.hasOwnProperty("head"))
                if (!$util.isInteger(message.head))
                    return "head: integer expected";
            if (message.full != null && message.hasOwnProperty("full")) {
                var error = $root.ListContacts.verify(message.full);
                if (error)
                    return "full." + error;
            }
            if (message.changed != null && message.hasOwnProperty("changed")) {
                var error = $root.ListContacts.verify(message.changed);
                if (error)
                    return "changed." + error;
            }
            if (message.removed != null && message.hasOwnProperty("removed")) {
                var error = $root.ListContacts.verify(message.removed);
                if (error)
                    return "removed." + error;
            }
            if (message.selfcontact != null && message.hasOwnProperty("selfcontact")) {
                var error = $root.Contact.verify(message.selfcontact);
                if (error)
                    return "selfcontact." + error;
            }
            return null;
        };
    
        /**
         * Creates a NotifyContacts message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof NotifyContacts
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {NotifyContacts} NotifyContacts
         */
        NotifyContacts.fromObject = function fromObject(object) {
            if (object instanceof $root.NotifyContacts)
                return object;
            var message = new $root.NotifyContacts();
            if (object.head != null)
                message.head = object.head | 0;
            if (object.full != null) {
                if (typeof object.full !== "object")
                    throw TypeError(".NotifyContacts.full: object expected");
                message.full = $root.ListContacts.fromObject(object.full);
            }
            if (object.changed != null) {
                if (typeof object.changed !== "object")
                    throw TypeError(".NotifyContacts.changed: object expected");
                message.changed = $root.ListContacts.fromObject(object.changed);
            }
            if (object.removed != null) {
                if (typeof object.removed !== "object")
                    throw TypeError(".NotifyContacts.removed: object expected");
                message.removed = $root.ListContacts.fromObject(object.removed);
            }
            if (object.selfcontact != null) {
                if (typeof object.selfcontact !== "object")
                    throw TypeError(".NotifyContacts.selfcontact: object expected");
                message.selfcontact = $root.Contact.fromObject(object.selfcontact);
            }
            return message;
        };
    
        /**
         * Creates a plain object from a NotifyContacts message. Also converts values to other types if specified.
         * @function toObject
         * @memberof NotifyContacts
         * @static
         * @param {NotifyContacts} message NotifyContacts
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NotifyContacts.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.head = 0;
                object.full = null;
                object.changed = null;
                object.removed = null;
                object.selfcontact = null;
            }
            if (message.head != null && message.hasOwnProperty("head"))
                object.head = message.head;
            if (message.full != null && message.hasOwnProperty("full"))
                object.full = $root.ListContacts.toObject(message.full, options);
            if (message.changed != null && message.hasOwnProperty("changed"))
                object.changed = $root.ListContacts.toObject(message.changed, options);
            if (message.removed != null && message.hasOwnProperty("removed"))
                object.removed = $root.ListContacts.toObject(message.removed, options);
            if (message.selfcontact != null && message.hasOwnProperty("selfcontact"))
                object.selfcontact = $root.Contact.toObject(message.selfcontact, options);
            return object;
        };
    
        /**
         * Converts this NotifyContacts to JSON.
         * @function toJSON
         * @memberof NotifyContacts
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NotifyContacts.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return NotifyContacts;
    })();
    
    $root.UpdateContacts = (function() {
    
        /**
         * Properties of an UpdateContacts.
         * @exports IUpdateContacts
         * @interface IUpdateContacts
         * @property {number|null} [head] UpdateContacts head
         * @property {IListContacts|null} [full] UpdateContacts full
         * @property {IListContacts|null} [added] UpdateContacts added
         * @property {IListContacts|null} [changed] UpdateContacts changed
         * @property {IListContacts|null} [removed] UpdateContacts removed
         */
    
        /**
         * Constructs a new UpdateContacts.
         * @exports UpdateContacts
         * @classdesc Represents an UpdateContacts.
         * @implements IUpdateContacts
         * @constructor
         * @param {IUpdateContacts=} [properties] Properties to set
         */
        function UpdateContacts(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * UpdateContacts head.
         * @member {number} head
         * @memberof UpdateContacts
         * @instance
         */
        UpdateContacts.prototype.head = 0;
    
        /**
         * UpdateContacts full.
         * @member {IListContacts|null|undefined} full
         * @memberof UpdateContacts
         * @instance
         */
        UpdateContacts.prototype.full = null;
    
        /**
         * UpdateContacts added.
         * @member {IListContacts|null|undefined} added
         * @memberof UpdateContacts
         * @instance
         */
        UpdateContacts.prototype.added = null;
    
        /**
         * UpdateContacts changed.
         * @member {IListContacts|null|undefined} changed
         * @memberof UpdateContacts
         * @instance
         */
        UpdateContacts.prototype.changed = null;
    
        /**
         * UpdateContacts removed.
         * @member {IListContacts|null|undefined} removed
         * @memberof UpdateContacts
         * @instance
         */
        UpdateContacts.prototype.removed = null;
    
        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;
    
        /**
         * UpdateContacts payload.
         * @member {"full"|"added"|"changed"|"removed"|undefined} payload
         * @memberof UpdateContacts
         * @instance
         */
        Object.defineProperty(UpdateContacts.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["full", "added", "changed", "removed"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Creates a new UpdateContacts instance using the specified properties.
         * @function create
         * @memberof UpdateContacts
         * @static
         * @param {IUpdateContacts=} [properties] Properties to set
         * @returns {UpdateContacts} UpdateContacts instance
         */
        UpdateContacts.create = function create(properties) {
            return new UpdateContacts(properties);
        };
    
        /**
         * Encodes the specified UpdateContacts message. Does not implicitly {@link UpdateContacts.verify|verify} messages.
         * @function encode
         * @memberof UpdateContacts
         * @static
         * @param {IUpdateContacts} message UpdateContacts message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateContacts.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.head != null && message.hasOwnProperty("head"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.head);
            if (message.full != null && message.hasOwnProperty("full"))
                $root.ListContacts.encode(message.full, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.added != null && message.hasOwnProperty("added"))
                $root.ListContacts.encode(message.added, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.changed != null && message.hasOwnProperty("changed"))
                $root.ListContacts.encode(message.changed, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.removed != null && message.hasOwnProperty("removed"))
                $root.ListContacts.encode(message.removed, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified UpdateContacts message, length delimited. Does not implicitly {@link UpdateContacts.verify|verify} messages.
         * @function encodeDelimited
         * @memberof UpdateContacts
         * @static
         * @param {IUpdateContacts} message UpdateContacts message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateContacts.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes an UpdateContacts message from the specified reader or buffer.
         * @function decode
         * @memberof UpdateContacts
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {UpdateContacts} UpdateContacts
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateContacts.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UpdateContacts();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.head = reader.int32();
                    break;
                case 2:
                    message.full = $root.ListContacts.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.added = $root.ListContacts.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.changed = $root.ListContacts.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.removed = $root.ListContacts.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes an UpdateContacts message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof UpdateContacts
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {UpdateContacts} UpdateContacts
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateContacts.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies an UpdateContacts message.
         * @function verify
         * @memberof UpdateContacts
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateContacts.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.head != null && message.hasOwnProperty("head"))
                if (!$util.isInteger(message.head))
                    return "head: integer expected";
            if (message.full != null && message.hasOwnProperty("full")) {
                properties.payload = 1;
                {
                    var error = $root.ListContacts.verify(message.full);
                    if (error)
                        return "full." + error;
                }
            }
            if (message.added != null && message.hasOwnProperty("added")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.ListContacts.verify(message.added);
                    if (error)
                        return "added." + error;
                }
            }
            if (message.changed != null && message.hasOwnProperty("changed")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.ListContacts.verify(message.changed);
                    if (error)
                        return "changed." + error;
                }
            }
            if (message.removed != null && message.hasOwnProperty("removed")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.ListContacts.verify(message.removed);
                    if (error)
                        return "removed." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates an UpdateContacts message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof UpdateContacts
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {UpdateContacts} UpdateContacts
         */
        UpdateContacts.fromObject = function fromObject(object) {
            if (object instanceof $root.UpdateContacts)
                return object;
            var message = new $root.UpdateContacts();
            if (object.head != null)
                message.head = object.head | 0;
            if (object.full != null) {
                if (typeof object.full !== "object")
                    throw TypeError(".UpdateContacts.full: object expected");
                message.full = $root.ListContacts.fromObject(object.full);
            }
            if (object.added != null) {
                if (typeof object.added !== "object")
                    throw TypeError(".UpdateContacts.added: object expected");
                message.added = $root.ListContacts.fromObject(object.added);
            }
            if (object.changed != null) {
                if (typeof object.changed !== "object")
                    throw TypeError(".UpdateContacts.changed: object expected");
                message.changed = $root.ListContacts.fromObject(object.changed);
            }
            if (object.removed != null) {
                if (typeof object.removed !== "object")
                    throw TypeError(".UpdateContacts.removed: object expected");
                message.removed = $root.ListContacts.fromObject(object.removed);
            }
            return message;
        };
    
        /**
         * Creates a plain object from an UpdateContacts message. Also converts values to other types if specified.
         * @function toObject
         * @memberof UpdateContacts
         * @static
         * @param {UpdateContacts} message UpdateContacts
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateContacts.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.head = 0;
            if (message.head != null && message.hasOwnProperty("head"))
                object.head = message.head;
            if (message.full != null && message.hasOwnProperty("full")) {
                object.full = $root.ListContacts.toObject(message.full, options);
                if (options.oneofs)
                    object.payload = "full";
            }
            if (message.added != null && message.hasOwnProperty("added")) {
                object.added = $root.ListContacts.toObject(message.added, options);
                if (options.oneofs)
                    object.payload = "added";
            }
            if (message.changed != null && message.hasOwnProperty("changed")) {
                object.changed = $root.ListContacts.toObject(message.changed, options);
                if (options.oneofs)
                    object.payload = "changed";
            }
            if (message.removed != null && message.hasOwnProperty("removed")) {
                object.removed = $root.ListContacts.toObject(message.removed, options);
                if (options.oneofs)
                    object.payload = "removed";
            }
            return object;
        };
    
        /**
         * Converts this UpdateContacts to JSON.
         * @function toJSON
         * @memberof UpdateContacts
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateContacts.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return UpdateContacts;
    })();
    
    $root.SubscribeContacts = (function() {
    
        /**
         * Properties of a SubscribeContacts.
         * @exports ISubscribeContacts
         * @interface ISubscribeContacts
         * @property {number|null} [personalcontactlist] SubscribeContacts personalcontactlist
         * @property {number|null} [selfcontact] SubscribeContacts selfcontact
         */
    
        /**
         * Constructs a new SubscribeContacts.
         * @exports SubscribeContacts
         * @classdesc Represents a SubscribeContacts.
         * @implements ISubscribeContacts
         * @constructor
         * @param {ISubscribeContacts=} [properties] Properties to set
         */
        function SubscribeContacts(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * SubscribeContacts personalcontactlist.
         * @member {number} personalcontactlist
         * @memberof SubscribeContacts
         * @instance
         */
        SubscribeContacts.prototype.personalcontactlist = 0;
    
        /**
         * SubscribeContacts selfcontact.
         * @member {number} selfcontact
         * @memberof SubscribeContacts
         * @instance
         */
        SubscribeContacts.prototype.selfcontact = 0;
    
        /**
         * Creates a new SubscribeContacts instance using the specified properties.
         * @function create
         * @memberof SubscribeContacts
         * @static
         * @param {ISubscribeContacts=} [properties] Properties to set
         * @returns {SubscribeContacts} SubscribeContacts instance
         */
        SubscribeContacts.create = function create(properties) {
            return new SubscribeContacts(properties);
        };
    
        /**
         * Encodes the specified SubscribeContacts message. Does not implicitly {@link SubscribeContacts.verify|verify} messages.
         * @function encode
         * @memberof SubscribeContacts
         * @static
         * @param {ISubscribeContacts} message SubscribeContacts message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubscribeContacts.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.personalcontactlist != null && message.hasOwnProperty("personalcontactlist"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.personalcontactlist);
            if (message.selfcontact != null && message.hasOwnProperty("selfcontact"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.selfcontact);
            return writer;
        };
    
        /**
         * Encodes the specified SubscribeContacts message, length delimited. Does not implicitly {@link SubscribeContacts.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SubscribeContacts
         * @static
         * @param {ISubscribeContacts} message SubscribeContacts message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubscribeContacts.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a SubscribeContacts message from the specified reader or buffer.
         * @function decode
         * @memberof SubscribeContacts
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SubscribeContacts} SubscribeContacts
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubscribeContacts.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SubscribeContacts();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.personalcontactlist = reader.int32();
                    break;
                case 2:
                    message.selfcontact = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a SubscribeContacts message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SubscribeContacts
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SubscribeContacts} SubscribeContacts
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubscribeContacts.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a SubscribeContacts message.
         * @function verify
         * @memberof SubscribeContacts
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SubscribeContacts.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.personalcontactlist != null && message.hasOwnProperty("personalcontactlist"))
                if (!$util.isInteger(message.personalcontactlist))
                    return "personalcontactlist: integer expected";
            if (message.selfcontact != null && message.hasOwnProperty("selfcontact"))
                if (!$util.isInteger(message.selfcontact))
                    return "selfcontact: integer expected";
            return null;
        };
    
        /**
         * Creates a SubscribeContacts message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SubscribeContacts
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SubscribeContacts} SubscribeContacts
         */
        SubscribeContacts.fromObject = function fromObject(object) {
            if (object instanceof $root.SubscribeContacts)
                return object;
            var message = new $root.SubscribeContacts();
            if (object.personalcontactlist != null)
                message.personalcontactlist = object.personalcontactlist | 0;
            if (object.selfcontact != null)
                message.selfcontact = object.selfcontact | 0;
            return message;
        };
    
        /**
         * Creates a plain object from a SubscribeContacts message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SubscribeContacts
         * @static
         * @param {SubscribeContacts} message SubscribeContacts
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SubscribeContacts.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.personalcontactlist = 0;
                object.selfcontact = 0;
            }
            if (message.personalcontactlist != null && message.hasOwnProperty("personalcontactlist"))
                object.personalcontactlist = message.personalcontactlist;
            if (message.selfcontact != null && message.hasOwnProperty("selfcontact"))
                object.selfcontact = message.selfcontact;
            return object;
        };
    
        /**
         * Converts this SubscribeContacts to JSON.
         * @function toJSON
         * @memberof SubscribeContacts
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SubscribeContacts.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return SubscribeContacts;
    })();
    
    $root.GetDirectory = (function() {
    
        /**
         * Properties of a GetDirectory.
         * @exports IGetDirectory
         * @interface IGetDirectory
         * @property {number|null} [cmdinst] GetDirectory cmdinst
         * @property {string|null} [filter] GetDirectory filter
         * @property {number|null} [maxentries] GetDirectory maxentries
         * @property {boolean|null} [personalcontacts] GetDirectory personalcontacts
         * @property {number|null} [numbersearch] GetDirectory numbersearch
         */
    
        /**
         * Constructs a new GetDirectory.
         * @exports GetDirectory
         * @classdesc Represents a GetDirectory.
         * @implements IGetDirectory
         * @constructor
         * @param {IGetDirectory=} [properties] Properties to set
         */
        function GetDirectory(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * GetDirectory cmdinst.
         * @member {number} cmdinst
         * @memberof GetDirectory
         * @instance
         */
        GetDirectory.prototype.cmdinst = 0;
    
        /**
         * GetDirectory filter.
         * @member {string} filter
         * @memberof GetDirectory
         * @instance
         */
        GetDirectory.prototype.filter = "";
    
        /**
         * GetDirectory maxentries.
         * @member {number} maxentries
         * @memberof GetDirectory
         * @instance
         */
        GetDirectory.prototype.maxentries = 0;
    
        /**
         * GetDirectory personalcontacts.
         * @member {boolean} personalcontacts
         * @memberof GetDirectory
         * @instance
         */
        GetDirectory.prototype.personalcontacts = false;
    
        /**
         * GetDirectory numbersearch.
         * @member {number} numbersearch
         * @memberof GetDirectory
         * @instance
         */
        GetDirectory.prototype.numbersearch = 0;
    
        /**
         * Creates a new GetDirectory instance using the specified properties.
         * @function create
         * @memberof GetDirectory
         * @static
         * @param {IGetDirectory=} [properties] Properties to set
         * @returns {GetDirectory} GetDirectory instance
         */
        GetDirectory.create = function create(properties) {
            return new GetDirectory(properties);
        };
    
        /**
         * Encodes the specified GetDirectory message. Does not implicitly {@link GetDirectory.verify|verify} messages.
         * @function encode
         * @memberof GetDirectory
         * @static
         * @param {IGetDirectory} message GetDirectory message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetDirectory.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cmdinst);
            if (message.filter != null && message.hasOwnProperty("filter"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.filter);
            if (message.maxentries != null && message.hasOwnProperty("maxentries"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.maxentries);
            if (message.personalcontacts != null && message.hasOwnProperty("personalcontacts"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.personalcontacts);
            if (message.numbersearch != null && message.hasOwnProperty("numbersearch"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.numbersearch);
            return writer;
        };
    
        /**
         * Encodes the specified GetDirectory message, length delimited. Does not implicitly {@link GetDirectory.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GetDirectory
         * @static
         * @param {IGetDirectory} message GetDirectory message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetDirectory.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a GetDirectory message from the specified reader or buffer.
         * @function decode
         * @memberof GetDirectory
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GetDirectory} GetDirectory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetDirectory.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetDirectory();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cmdinst = reader.int32();
                    break;
                case 2:
                    message.filter = reader.string();
                    break;
                case 3:
                    message.maxentries = reader.int32();
                    break;
                case 4:
                    message.personalcontacts = reader.bool();
                    break;
                case 5:
                    message.numbersearch = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a GetDirectory message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GetDirectory
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GetDirectory} GetDirectory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetDirectory.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a GetDirectory message.
         * @function verify
         * @memberof GetDirectory
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetDirectory.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                if (!$util.isInteger(message.cmdinst))
                    return "cmdinst: integer expected";
            if (message.filter != null && message.hasOwnProperty("filter"))
                if (!$util.isString(message.filter))
                    return "filter: string expected";
            if (message.maxentries != null && message.hasOwnProperty("maxentries"))
                if (!$util.isInteger(message.maxentries))
                    return "maxentries: integer expected";
            if (message.personalcontacts != null && message.hasOwnProperty("personalcontacts"))
                if (typeof message.personalcontacts !== "boolean")
                    return "personalcontacts: boolean expected";
            if (message.numbersearch != null && message.hasOwnProperty("numbersearch"))
                if (!$util.isInteger(message.numbersearch))
                    return "numbersearch: integer expected";
            return null;
        };
    
        /**
         * Creates a GetDirectory message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GetDirectory
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GetDirectory} GetDirectory
         */
        GetDirectory.fromObject = function fromObject(object) {
            if (object instanceof $root.GetDirectory)
                return object;
            var message = new $root.GetDirectory();
            if (object.cmdinst != null)
                message.cmdinst = object.cmdinst | 0;
            if (object.filter != null)
                message.filter = String(object.filter);
            if (object.maxentries != null)
                message.maxentries = object.maxentries | 0;
            if (object.personalcontacts != null)
                message.personalcontacts = Boolean(object.personalcontacts);
            if (object.numbersearch != null)
                message.numbersearch = object.numbersearch | 0;
            return message;
        };
    
        /**
         * Creates a plain object from a GetDirectory message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GetDirectory
         * @static
         * @param {GetDirectory} message GetDirectory
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetDirectory.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cmdinst = 0;
                object.filter = "";
                object.maxentries = 0;
                object.personalcontacts = false;
                object.numbersearch = 0;
            }
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                object.cmdinst = message.cmdinst;
            if (message.filter != null && message.hasOwnProperty("filter"))
                object.filter = message.filter;
            if (message.maxentries != null && message.hasOwnProperty("maxentries"))
                object.maxentries = message.maxentries;
            if (message.personalcontacts != null && message.hasOwnProperty("personalcontacts"))
                object.personalcontacts = message.personalcontacts;
            if (message.numbersearch != null && message.hasOwnProperty("numbersearch"))
                object.numbersearch = message.numbersearch;
            return object;
        };
    
        /**
         * Converts this GetDirectory to JSON.
         * @function toJSON
         * @memberof GetDirectory
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetDirectory.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return GetDirectory;
    })();
    
    $root.GetDirectoryResponse = (function() {
    
        /**
         * Properties of a GetDirectoryResponse.
         * @exports IGetDirectoryResponse
         * @interface IGetDirectoryResponse
         * @property {number|null} [cmdinst] GetDirectoryResponse cmdinst
         * @property {string|null} [filter] GetDirectoryResponse filter
         * @property {number|null} [complete] GetDirectoryResponse complete
         * @property {boolean|null} [personalcontacts] GetDirectoryResponse personalcontacts
         * @property {number|null} [head] GetDirectoryResponse head
         * @property {IListContacts|null} [list] GetDirectoryResponse list
         */
    
        /**
         * Constructs a new GetDirectoryResponse.
         * @exports GetDirectoryResponse
         * @classdesc Represents a GetDirectoryResponse.
         * @implements IGetDirectoryResponse
         * @constructor
         * @param {IGetDirectoryResponse=} [properties] Properties to set
         */
        function GetDirectoryResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * GetDirectoryResponse cmdinst.
         * @member {number} cmdinst
         * @memberof GetDirectoryResponse
         * @instance
         */
        GetDirectoryResponse.prototype.cmdinst = 0;
    
        /**
         * GetDirectoryResponse filter.
         * @member {string} filter
         * @memberof GetDirectoryResponse
         * @instance
         */
        GetDirectoryResponse.prototype.filter = "";
    
        /**
         * GetDirectoryResponse complete.
         * @member {number} complete
         * @memberof GetDirectoryResponse
         * @instance
         */
        GetDirectoryResponse.prototype.complete = 0;
    
        /**
         * GetDirectoryResponse personalcontacts.
         * @member {boolean} personalcontacts
         * @memberof GetDirectoryResponse
         * @instance
         */
        GetDirectoryResponse.prototype.personalcontacts = false;
    
        /**
         * GetDirectoryResponse head.
         * @member {number} head
         * @memberof GetDirectoryResponse
         * @instance
         */
        GetDirectoryResponse.prototype.head = 0;
    
        /**
         * GetDirectoryResponse list.
         * @member {IListContacts|null|undefined} list
         * @memberof GetDirectoryResponse
         * @instance
         */
        GetDirectoryResponse.prototype.list = null;
    
        /**
         * Creates a new GetDirectoryResponse instance using the specified properties.
         * @function create
         * @memberof GetDirectoryResponse
         * @static
         * @param {IGetDirectoryResponse=} [properties] Properties to set
         * @returns {GetDirectoryResponse} GetDirectoryResponse instance
         */
        GetDirectoryResponse.create = function create(properties) {
            return new GetDirectoryResponse(properties);
        };
    
        /**
         * Encodes the specified GetDirectoryResponse message. Does not implicitly {@link GetDirectoryResponse.verify|verify} messages.
         * @function encode
         * @memberof GetDirectoryResponse
         * @static
         * @param {IGetDirectoryResponse} message GetDirectoryResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetDirectoryResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cmdinst);
            if (message.filter != null && message.hasOwnProperty("filter"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.filter);
            if (message.complete != null && message.hasOwnProperty("complete"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.complete);
            if (message.personalcontacts != null && message.hasOwnProperty("personalcontacts"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.personalcontacts);
            if (message.head != null && message.hasOwnProperty("head"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.head);
            if (message.list != null && message.hasOwnProperty("list"))
                $root.ListContacts.encode(message.list, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified GetDirectoryResponse message, length delimited. Does not implicitly {@link GetDirectoryResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GetDirectoryResponse
         * @static
         * @param {IGetDirectoryResponse} message GetDirectoryResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetDirectoryResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a GetDirectoryResponse message from the specified reader or buffer.
         * @function decode
         * @memberof GetDirectoryResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GetDirectoryResponse} GetDirectoryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetDirectoryResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetDirectoryResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cmdinst = reader.int32();
                    break;
                case 2:
                    message.filter = reader.string();
                    break;
                case 3:
                    message.complete = reader.int32();
                    break;
                case 4:
                    message.personalcontacts = reader.bool();
                    break;
                case 5:
                    message.head = reader.int32();
                    break;
                case 6:
                    message.list = $root.ListContacts.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a GetDirectoryResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GetDirectoryResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GetDirectoryResponse} GetDirectoryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetDirectoryResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a GetDirectoryResponse message.
         * @function verify
         * @memberof GetDirectoryResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetDirectoryResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                if (!$util.isInteger(message.cmdinst))
                    return "cmdinst: integer expected";
            if (message.filter != null && message.hasOwnProperty("filter"))
                if (!$util.isString(message.filter))
                    return "filter: string expected";
            if (message.complete != null && message.hasOwnProperty("complete"))
                if (!$util.isInteger(message.complete))
                    return "complete: integer expected";
            if (message.personalcontacts != null && message.hasOwnProperty("personalcontacts"))
                if (typeof message.personalcontacts !== "boolean")
                    return "personalcontacts: boolean expected";
            if (message.head != null && message.hasOwnProperty("head"))
                if (!$util.isInteger(message.head))
                    return "head: integer expected";
            if (message.list != null && message.hasOwnProperty("list")) {
                var error = $root.ListContacts.verify(message.list);
                if (error)
                    return "list." + error;
            }
            return null;
        };
    
        /**
         * Creates a GetDirectoryResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GetDirectoryResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GetDirectoryResponse} GetDirectoryResponse
         */
        GetDirectoryResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.GetDirectoryResponse)
                return object;
            var message = new $root.GetDirectoryResponse();
            if (object.cmdinst != null)
                message.cmdinst = object.cmdinst | 0;
            if (object.filter != null)
                message.filter = String(object.filter);
            if (object.complete != null)
                message.complete = object.complete | 0;
            if (object.personalcontacts != null)
                message.personalcontacts = Boolean(object.personalcontacts);
            if (object.head != null)
                message.head = object.head | 0;
            if (object.list != null) {
                if (typeof object.list !== "object")
                    throw TypeError(".GetDirectoryResponse.list: object expected");
                message.list = $root.ListContacts.fromObject(object.list);
            }
            return message;
        };
    
        /**
         * Creates a plain object from a GetDirectoryResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GetDirectoryResponse
         * @static
         * @param {GetDirectoryResponse} message GetDirectoryResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetDirectoryResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cmdinst = 0;
                object.filter = "";
                object.complete = 0;
                object.personalcontacts = false;
                object.head = 0;
                object.list = null;
            }
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                object.cmdinst = message.cmdinst;
            if (message.filter != null && message.hasOwnProperty("filter"))
                object.filter = message.filter;
            if (message.complete != null && message.hasOwnProperty("complete"))
                object.complete = message.complete;
            if (message.personalcontacts != null && message.hasOwnProperty("personalcontacts"))
                object.personalcontacts = message.personalcontacts;
            if (message.head != null && message.hasOwnProperty("head"))
                object.head = message.head;
            if (message.list != null && message.hasOwnProperty("list"))
                object.list = $root.ListContacts.toObject(message.list, options);
            return object;
        };
    
        /**
         * Converts this GetDirectoryResponse to JSON.
         * @function toJSON
         * @memberof GetDirectoryResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetDirectoryResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return GetDirectoryResponse;
    })();
    
    $root.GetContact = (function() {
    
        /**
         * Properties of a GetContact.
         * @exports IGetContact
         * @interface IGetContact
         * @property {number|null} [cmdinst] GetContact cmdinst
         * @property {boolean|null} [selfcontact] GetContact selfcontact
         * @property {string|null} [name] GetContact name
         */
    
        /**
         * Constructs a new GetContact.
         * @exports GetContact
         * @classdesc Represents a GetContact.
         * @implements IGetContact
         * @constructor
         * @param {IGetContact=} [properties] Properties to set
         */
        function GetContact(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * GetContact cmdinst.
         * @member {number} cmdinst
         * @memberof GetContact
         * @instance
         */
        GetContact.prototype.cmdinst = 0;
    
        /**
         * GetContact selfcontact.
         * @member {boolean} selfcontact
         * @memberof GetContact
         * @instance
         */
        GetContact.prototype.selfcontact = false;
    
        /**
         * GetContact name.
         * @member {string} name
         * @memberof GetContact
         * @instance
         */
        GetContact.prototype.name = "";
    
        /**
         * Creates a new GetContact instance using the specified properties.
         * @function create
         * @memberof GetContact
         * @static
         * @param {IGetContact=} [properties] Properties to set
         * @returns {GetContact} GetContact instance
         */
        GetContact.create = function create(properties) {
            return new GetContact(properties);
        };
    
        /**
         * Encodes the specified GetContact message. Does not implicitly {@link GetContact.verify|verify} messages.
         * @function encode
         * @memberof GetContact
         * @static
         * @param {IGetContact} message GetContact message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetContact.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cmdinst);
            if (message.selfcontact != null && message.hasOwnProperty("selfcontact"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.selfcontact);
            if (message.name != null && message.hasOwnProperty("name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            return writer;
        };
    
        /**
         * Encodes the specified GetContact message, length delimited. Does not implicitly {@link GetContact.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GetContact
         * @static
         * @param {IGetContact} message GetContact message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetContact.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a GetContact message from the specified reader or buffer.
         * @function decode
         * @memberof GetContact
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GetContact} GetContact
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetContact.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetContact();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cmdinst = reader.int32();
                    break;
                case 2:
                    message.selfcontact = reader.bool();
                    break;
                case 3:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a GetContact message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GetContact
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GetContact} GetContact
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetContact.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a GetContact message.
         * @function verify
         * @memberof GetContact
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetContact.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                if (!$util.isInteger(message.cmdinst))
                    return "cmdinst: integer expected";
            if (message.selfcontact != null && message.hasOwnProperty("selfcontact"))
                if (typeof message.selfcontact !== "boolean")
                    return "selfcontact: boolean expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            return null;
        };
    
        /**
         * Creates a GetContact message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GetContact
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GetContact} GetContact
         */
        GetContact.fromObject = function fromObject(object) {
            if (object instanceof $root.GetContact)
                return object;
            var message = new $root.GetContact();
            if (object.cmdinst != null)
                message.cmdinst = object.cmdinst | 0;
            if (object.selfcontact != null)
                message.selfcontact = Boolean(object.selfcontact);
            if (object.name != null)
                message.name = String(object.name);
            return message;
        };
    
        /**
         * Creates a plain object from a GetContact message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GetContact
         * @static
         * @param {GetContact} message GetContact
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetContact.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cmdinst = 0;
                object.selfcontact = false;
                object.name = "";
            }
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                object.cmdinst = message.cmdinst;
            if (message.selfcontact != null && message.hasOwnProperty("selfcontact"))
                object.selfcontact = message.selfcontact;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            return object;
        };
    
        /**
         * Converts this GetContact to JSON.
         * @function toJSON
         * @memberof GetContact
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetContact.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return GetContact;
    })();
    
    $root.GetContactResponse = (function() {
    
        /**
         * Properties of a GetContactResponse.
         * @exports IGetContactResponse
         * @interface IGetContactResponse
         * @property {number|null} [cmdinst] GetContactResponse cmdinst
         * @property {boolean|null} [selfcontact] GetContactResponse selfcontact
         * @property {IContact|null} [contact] GetContactResponse contact
         */
    
        /**
         * Constructs a new GetContactResponse.
         * @exports GetContactResponse
         * @classdesc Represents a GetContactResponse.
         * @implements IGetContactResponse
         * @constructor
         * @param {IGetContactResponse=} [properties] Properties to set
         */
        function GetContactResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * GetContactResponse cmdinst.
         * @member {number} cmdinst
         * @memberof GetContactResponse
         * @instance
         */
        GetContactResponse.prototype.cmdinst = 0;
    
        /**
         * GetContactResponse selfcontact.
         * @member {boolean} selfcontact
         * @memberof GetContactResponse
         * @instance
         */
        GetContactResponse.prototype.selfcontact = false;
    
        /**
         * GetContactResponse contact.
         * @member {IContact|null|undefined} contact
         * @memberof GetContactResponse
         * @instance
         */
        GetContactResponse.prototype.contact = null;
    
        /**
         * Creates a new GetContactResponse instance using the specified properties.
         * @function create
         * @memberof GetContactResponse
         * @static
         * @param {IGetContactResponse=} [properties] Properties to set
         * @returns {GetContactResponse} GetContactResponse instance
         */
        GetContactResponse.create = function create(properties) {
            return new GetContactResponse(properties);
        };
    
        /**
         * Encodes the specified GetContactResponse message. Does not implicitly {@link GetContactResponse.verify|verify} messages.
         * @function encode
         * @memberof GetContactResponse
         * @static
         * @param {IGetContactResponse} message GetContactResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetContactResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cmdinst);
            if (message.selfcontact != null && message.hasOwnProperty("selfcontact"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.selfcontact);
            if (message.contact != null && message.hasOwnProperty("contact"))
                $root.Contact.encode(message.contact, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified GetContactResponse message, length delimited. Does not implicitly {@link GetContactResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GetContactResponse
         * @static
         * @param {IGetContactResponse} message GetContactResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetContactResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a GetContactResponse message from the specified reader or buffer.
         * @function decode
         * @memberof GetContactResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GetContactResponse} GetContactResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetContactResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetContactResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cmdinst = reader.int32();
                    break;
                case 2:
                    message.selfcontact = reader.bool();
                    break;
                case 3:
                    message.contact = $root.Contact.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a GetContactResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GetContactResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GetContactResponse} GetContactResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetContactResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a GetContactResponse message.
         * @function verify
         * @memberof GetContactResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetContactResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                if (!$util.isInteger(message.cmdinst))
                    return "cmdinst: integer expected";
            if (message.selfcontact != null && message.hasOwnProperty("selfcontact"))
                if (typeof message.selfcontact !== "boolean")
                    return "selfcontact: boolean expected";
            if (message.contact != null && message.hasOwnProperty("contact")) {
                var error = $root.Contact.verify(message.contact);
                if (error)
                    return "contact." + error;
            }
            return null;
        };
    
        /**
         * Creates a GetContactResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GetContactResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GetContactResponse} GetContactResponse
         */
        GetContactResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.GetContactResponse)
                return object;
            var message = new $root.GetContactResponse();
            if (object.cmdinst != null)
                message.cmdinst = object.cmdinst | 0;
            if (object.selfcontact != null)
                message.selfcontact = Boolean(object.selfcontact);
            if (object.contact != null) {
                if (typeof object.contact !== "object")
                    throw TypeError(".GetContactResponse.contact: object expected");
                message.contact = $root.Contact.fromObject(object.contact);
            }
            return message;
        };
    
        /**
         * Creates a plain object from a GetContactResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GetContactResponse
         * @static
         * @param {GetContactResponse} message GetContactResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetContactResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cmdinst = 0;
                object.selfcontact = false;
                object.contact = null;
            }
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                object.cmdinst = message.cmdinst;
            if (message.selfcontact != null && message.hasOwnProperty("selfcontact"))
                object.selfcontact = message.selfcontact;
            if (message.contact != null && message.hasOwnProperty("contact"))
                object.contact = $root.Contact.toObject(message.contact, options);
            return object;
        };
    
        /**
         * Converts this GetContactResponse to JSON.
         * @function toJSON
         * @memberof GetContactResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetContactResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return GetContactResponse;
    })();
    
    $root.GetCapability = (function() {
    
        /**
         * Properties of a GetCapability.
         * @exports IGetCapability
         * @interface IGetCapability
         * @property {number|null} [cmdinst] GetCapability cmdinst
         */
    
        /**
         * Constructs a new GetCapability.
         * @exports GetCapability
         * @classdesc Represents a GetCapability.
         * @implements IGetCapability
         * @constructor
         * @param {IGetCapability=} [properties] Properties to set
         */
        function GetCapability(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * GetCapability cmdinst.
         * @member {number} cmdinst
         * @memberof GetCapability
         * @instance
         */
        GetCapability.prototype.cmdinst = 0;
    
        /**
         * Creates a new GetCapability instance using the specified properties.
         * @function create
         * @memberof GetCapability
         * @static
         * @param {IGetCapability=} [properties] Properties to set
         * @returns {GetCapability} GetCapability instance
         */
        GetCapability.create = function create(properties) {
            return new GetCapability(properties);
        };
    
        /**
         * Encodes the specified GetCapability message. Does not implicitly {@link GetCapability.verify|verify} messages.
         * @function encode
         * @memberof GetCapability
         * @static
         * @param {IGetCapability} message GetCapability message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetCapability.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cmdinst);
            return writer;
        };
    
        /**
         * Encodes the specified GetCapability message, length delimited. Does not implicitly {@link GetCapability.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GetCapability
         * @static
         * @param {IGetCapability} message GetCapability message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetCapability.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a GetCapability message from the specified reader or buffer.
         * @function decode
         * @memberof GetCapability
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GetCapability} GetCapability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetCapability.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetCapability();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cmdinst = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a GetCapability message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GetCapability
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GetCapability} GetCapability
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetCapability.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a GetCapability message.
         * @function verify
         * @memberof GetCapability
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetCapability.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                if (!$util.isInteger(message.cmdinst))
                    return "cmdinst: integer expected";
            return null;
        };
    
        /**
         * Creates a GetCapability message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GetCapability
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GetCapability} GetCapability
         */
        GetCapability.fromObject = function fromObject(object) {
            if (object instanceof $root.GetCapability)
                return object;
            var message = new $root.GetCapability();
            if (object.cmdinst != null)
                message.cmdinst = object.cmdinst | 0;
            return message;
        };
    
        /**
         * Creates a plain object from a GetCapability message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GetCapability
         * @static
         * @param {GetCapability} message GetCapability
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetCapability.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.cmdinst = 0;
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                object.cmdinst = message.cmdinst;
            return object;
        };
    
        /**
         * Converts this GetCapability to JSON.
         * @function toJSON
         * @memberof GetCapability
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetCapability.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return GetCapability;
    })();
    
    $root.GetCapabilityResponse = (function() {
    
        /**
         * Properties of a GetCapabilityResponse.
         * @exports IGetCapabilityResponse
         * @interface IGetCapabilityResponse
         * @property {number|null} [cmdinst] GetCapabilityResponse cmdinst
         * @property {boolean|null} [subscribecontact] GetCapabilityResponse subscribecontact
         * @property {boolean|null} [addcontact] GetCapabilityResponse addcontact
         * @property {boolean|null} [deletecontact] GetCapabilityResponse deletecontact
         * @property {boolean|null} [updatecontact] GetCapabilityResponse updatecontact
         * @property {boolean|null} [directorysearch] GetCapabilityResponse directorysearch
         * @property {boolean|null} [favoritecontacts] GetCapabilityResponse favoritecontacts
         * @property {boolean|null} [retrievepictures] GetCapabilityResponse retrievepictures
         * @property {boolean|null} [networksearchterminal] GetCapabilityResponse networksearchterminal
         * @property {boolean|null} [resolveenterprisecontacts] GetCapabilityResponse resolveenterprisecontacts
         * @property {string|null} [version] GetCapabilityResponse version
         * @property {number|null} [directorynumbersearch] GetCapabilityResponse directorynumbersearch
         * @property {boolean|null} [subscribecallcontrol] GetCapabilityResponse subscribecallcontrol
         * @property {boolean|null} [subscribecalllog] GetCapabilityResponse subscribecalllog
         */
    
        /**
         * Constructs a new GetCapabilityResponse.
         * @exports GetCapabilityResponse
         * @classdesc Represents a GetCapabilityResponse.
         * @implements IGetCapabilityResponse
         * @constructor
         * @param {IGetCapabilityResponse=} [properties] Properties to set
         */
        function GetCapabilityResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * GetCapabilityResponse cmdinst.
         * @member {number} cmdinst
         * @memberof GetCapabilityResponse
         * @instance
         */
        GetCapabilityResponse.prototype.cmdinst = 0;
    
        /**
         * GetCapabilityResponse subscribecontact.
         * @member {boolean} subscribecontact
         * @memberof GetCapabilityResponse
         * @instance
         */
        GetCapabilityResponse.prototype.subscribecontact = false;
    
        /**
         * GetCapabilityResponse addcontact.
         * @member {boolean} addcontact
         * @memberof GetCapabilityResponse
         * @instance
         */
        GetCapabilityResponse.prototype.addcontact = false;
    
        /**
         * GetCapabilityResponse deletecontact.
         * @member {boolean} deletecontact
         * @memberof GetCapabilityResponse
         * @instance
         */
        GetCapabilityResponse.prototype.deletecontact = false;
    
        /**
         * GetCapabilityResponse updatecontact.
         * @member {boolean} updatecontact
         * @memberof GetCapabilityResponse
         * @instance
         */
        GetCapabilityResponse.prototype.updatecontact = false;
    
        /**
         * GetCapabilityResponse directorysearch.
         * @member {boolean} directorysearch
         * @memberof GetCapabilityResponse
         * @instance
         */
        GetCapabilityResponse.prototype.directorysearch = false;
    
        /**
         * GetCapabilityResponse favoritecontacts.
         * @member {boolean} favoritecontacts
         * @memberof GetCapabilityResponse
         * @instance
         */
        GetCapabilityResponse.prototype.favoritecontacts = false;
    
        /**
         * GetCapabilityResponse retrievepictures.
         * @member {boolean} retrievepictures
         * @memberof GetCapabilityResponse
         * @instance
         */
        GetCapabilityResponse.prototype.retrievepictures = false;
    
        /**
         * GetCapabilityResponse networksearchterminal.
         * @member {boolean} networksearchterminal
         * @memberof GetCapabilityResponse
         * @instance
         */
        GetCapabilityResponse.prototype.networksearchterminal = false;
    
        /**
         * GetCapabilityResponse resolveenterprisecontacts.
         * @member {boolean} resolveenterprisecontacts
         * @memberof GetCapabilityResponse
         * @instance
         */
        GetCapabilityResponse.prototype.resolveenterprisecontacts = false;
    
        /**
         * GetCapabilityResponse version.
         * @member {string} version
         * @memberof GetCapabilityResponse
         * @instance
         */
        GetCapabilityResponse.prototype.version = "";
    
        /**
         * GetCapabilityResponse directorynumbersearch.
         * @member {number} directorynumbersearch
         * @memberof GetCapabilityResponse
         * @instance
         */
        GetCapabilityResponse.prototype.directorynumbersearch = 0;
    
        /**
         * GetCapabilityResponse subscribecallcontrol.
         * @member {boolean} subscribecallcontrol
         * @memberof GetCapabilityResponse
         * @instance
         */
        GetCapabilityResponse.prototype.subscribecallcontrol = false;
    
        /**
         * GetCapabilityResponse subscribecalllog.
         * @member {boolean} subscribecalllog
         * @memberof GetCapabilityResponse
         * @instance
         */
        GetCapabilityResponse.prototype.subscribecalllog = false;
    
        /**
         * Creates a new GetCapabilityResponse instance using the specified properties.
         * @function create
         * @memberof GetCapabilityResponse
         * @static
         * @param {IGetCapabilityResponse=} [properties] Properties to set
         * @returns {GetCapabilityResponse} GetCapabilityResponse instance
         */
        GetCapabilityResponse.create = function create(properties) {
            return new GetCapabilityResponse(properties);
        };
    
        /**
         * Encodes the specified GetCapabilityResponse message. Does not implicitly {@link GetCapabilityResponse.verify|verify} messages.
         * @function encode
         * @memberof GetCapabilityResponse
         * @static
         * @param {IGetCapabilityResponse} message GetCapabilityResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetCapabilityResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cmdinst);
            if (message.subscribecontact != null && message.hasOwnProperty("subscribecontact"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.subscribecontact);
            if (message.addcontact != null && message.hasOwnProperty("addcontact"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.addcontact);
            if (message.deletecontact != null && message.hasOwnProperty("deletecontact"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.deletecontact);
            if (message.updatecontact != null && message.hasOwnProperty("updatecontact"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.updatecontact);
            if (message.directorysearch != null && message.hasOwnProperty("directorysearch"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.directorysearch);
            if (message.favoritecontacts != null && message.hasOwnProperty("favoritecontacts"))
                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.favoritecontacts);
            if (message.retrievepictures != null && message.hasOwnProperty("retrievepictures"))
                writer.uint32(/* id 8, wireType 0 =*/64).bool(message.retrievepictures);
            if (message.networksearchterminal != null && message.hasOwnProperty("networksearchterminal"))
                writer.uint32(/* id 9, wireType 0 =*/72).bool(message.networksearchterminal);
            if (message.resolveenterprisecontacts != null && message.hasOwnProperty("resolveenterprisecontacts"))
                writer.uint32(/* id 10, wireType 0 =*/80).bool(message.resolveenterprisecontacts);
            if (message.version != null && message.hasOwnProperty("version"))
                writer.uint32(/* id 11, wireType 2 =*/90).string(message.version);
            if (message.directorynumbersearch != null && message.hasOwnProperty("directorynumbersearch"))
                writer.uint32(/* id 12, wireType 0 =*/96).int32(message.directorynumbersearch);
            if (message.subscribecallcontrol != null && message.hasOwnProperty("subscribecallcontrol"))
                writer.uint32(/* id 13, wireType 0 =*/104).bool(message.subscribecallcontrol);
            if (message.subscribecalllog != null && message.hasOwnProperty("subscribecalllog"))
                writer.uint32(/* id 14, wireType 0 =*/112).bool(message.subscribecalllog);
            return writer;
        };
    
        /**
         * Encodes the specified GetCapabilityResponse message, length delimited. Does not implicitly {@link GetCapabilityResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GetCapabilityResponse
         * @static
         * @param {IGetCapabilityResponse} message GetCapabilityResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetCapabilityResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a GetCapabilityResponse message from the specified reader or buffer.
         * @function decode
         * @memberof GetCapabilityResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GetCapabilityResponse} GetCapabilityResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetCapabilityResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GetCapabilityResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cmdinst = reader.int32();
                    break;
                case 2:
                    message.subscribecontact = reader.bool();
                    break;
                case 3:
                    message.addcontact = reader.bool();
                    break;
                case 4:
                    message.deletecontact = reader.bool();
                    break;
                case 5:
                    message.updatecontact = reader.bool();
                    break;
                case 6:
                    message.directorysearch = reader.bool();
                    break;
                case 7:
                    message.favoritecontacts = reader.bool();
                    break;
                case 8:
                    message.retrievepictures = reader.bool();
                    break;
                case 9:
                    message.networksearchterminal = reader.bool();
                    break;
                case 10:
                    message.resolveenterprisecontacts = reader.bool();
                    break;
                case 11:
                    message.version = reader.string();
                    break;
                case 12:
                    message.directorynumbersearch = reader.int32();
                    break;
                case 13:
                    message.subscribecallcontrol = reader.bool();
                    break;
                case 14:
                    message.subscribecalllog = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a GetCapabilityResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GetCapabilityResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GetCapabilityResponse} GetCapabilityResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetCapabilityResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a GetCapabilityResponse message.
         * @function verify
         * @memberof GetCapabilityResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetCapabilityResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                if (!$util.isInteger(message.cmdinst))
                    return "cmdinst: integer expected";
            if (message.subscribecontact != null && message.hasOwnProperty("subscribecontact"))
                if (typeof message.subscribecontact !== "boolean")
                    return "subscribecontact: boolean expected";
            if (message.addcontact != null && message.hasOwnProperty("addcontact"))
                if (typeof message.addcontact !== "boolean")
                    return "addcontact: boolean expected";
            if (message.deletecontact != null && message.hasOwnProperty("deletecontact"))
                if (typeof message.deletecontact !== "boolean")
                    return "deletecontact: boolean expected";
            if (message.updatecontact != null && message.hasOwnProperty("updatecontact"))
                if (typeof message.updatecontact !== "boolean")
                    return "updatecontact: boolean expected";
            if (message.directorysearch != null && message.hasOwnProperty("directorysearch"))
                if (typeof message.directorysearch !== "boolean")
                    return "directorysearch: boolean expected";
            if (message.favoritecontacts != null && message.hasOwnProperty("favoritecontacts"))
                if (typeof message.favoritecontacts !== "boolean")
                    return "favoritecontacts: boolean expected";
            if (message.retrievepictures != null && message.hasOwnProperty("retrievepictures"))
                if (typeof message.retrievepictures !== "boolean")
                    return "retrievepictures: boolean expected";
            if (message.networksearchterminal != null && message.hasOwnProperty("networksearchterminal"))
                if (typeof message.networksearchterminal !== "boolean")
                    return "networksearchterminal: boolean expected";
            if (message.resolveenterprisecontacts != null && message.hasOwnProperty("resolveenterprisecontacts"))
                if (typeof message.resolveenterprisecontacts !== "boolean")
                    return "resolveenterprisecontacts: boolean expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isString(message.version))
                    return "version: string expected";
            if (message.directorynumbersearch != null && message.hasOwnProperty("directorynumbersearch"))
                if (!$util.isInteger(message.directorynumbersearch))
                    return "directorynumbersearch: integer expected";
            if (message.subscribecallcontrol != null && message.hasOwnProperty("subscribecallcontrol"))
                if (typeof message.subscribecallcontrol !== "boolean")
                    return "subscribecallcontrol: boolean expected";
            if (message.subscribecalllog != null && message.hasOwnProperty("subscribecalllog"))
                if (typeof message.subscribecalllog !== "boolean")
                    return "subscribecalllog: boolean expected";
            return null;
        };
    
        /**
         * Creates a GetCapabilityResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GetCapabilityResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GetCapabilityResponse} GetCapabilityResponse
         */
        GetCapabilityResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.GetCapabilityResponse)
                return object;
            var message = new $root.GetCapabilityResponse();
            if (object.cmdinst != null)
                message.cmdinst = object.cmdinst | 0;
            if (object.subscribecontact != null)
                message.subscribecontact = Boolean(object.subscribecontact);
            if (object.addcontact != null)
                message.addcontact = Boolean(object.addcontact);
            if (object.deletecontact != null)
                message.deletecontact = Boolean(object.deletecontact);
            if (object.updatecontact != null)
                message.updatecontact = Boolean(object.updatecontact);
            if (object.directorysearch != null)
                message.directorysearch = Boolean(object.directorysearch);
            if (object.favoritecontacts != null)
                message.favoritecontacts = Boolean(object.favoritecontacts);
            if (object.retrievepictures != null)
                message.retrievepictures = Boolean(object.retrievepictures);
            if (object.networksearchterminal != null)
                message.networksearchterminal = Boolean(object.networksearchterminal);
            if (object.resolveenterprisecontacts != null)
                message.resolveenterprisecontacts = Boolean(object.resolveenterprisecontacts);
            if (object.version != null)
                message.version = String(object.version);
            if (object.directorynumbersearch != null)
                message.directorynumbersearch = object.directorynumbersearch | 0;
            if (object.subscribecallcontrol != null)
                message.subscribecallcontrol = Boolean(object.subscribecallcontrol);
            if (object.subscribecalllog != null)
                message.subscribecalllog = Boolean(object.subscribecalllog);
            return message;
        };
    
        /**
         * Creates a plain object from a GetCapabilityResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GetCapabilityResponse
         * @static
         * @param {GetCapabilityResponse} message GetCapabilityResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetCapabilityResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cmdinst = 0;
                object.subscribecontact = false;
                object.addcontact = false;
                object.deletecontact = false;
                object.updatecontact = false;
                object.directorysearch = false;
                object.favoritecontacts = false;
                object.retrievepictures = false;
                object.networksearchterminal = false;
                object.resolveenterprisecontacts = false;
                object.version = "";
                object.directorynumbersearch = 0;
                object.subscribecallcontrol = false;
                object.subscribecalllog = false;
            }
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                object.cmdinst = message.cmdinst;
            if (message.subscribecontact != null && message.hasOwnProperty("subscribecontact"))
                object.subscribecontact = message.subscribecontact;
            if (message.addcontact != null && message.hasOwnProperty("addcontact"))
                object.addcontact = message.addcontact;
            if (message.deletecontact != null && message.hasOwnProperty("deletecontact"))
                object.deletecontact = message.deletecontact;
            if (message.updatecontact != null && message.hasOwnProperty("updatecontact"))
                object.updatecontact = message.updatecontact;
            if (message.directorysearch != null && message.hasOwnProperty("directorysearch"))
                object.directorysearch = message.directorysearch;
            if (message.favoritecontacts != null && message.hasOwnProperty("favoritecontacts"))
                object.favoritecontacts = message.favoritecontacts;
            if (message.retrievepictures != null && message.hasOwnProperty("retrievepictures"))
                object.retrievepictures = message.retrievepictures;
            if (message.networksearchterminal != null && message.hasOwnProperty("networksearchterminal"))
                object.networksearchterminal = message.networksearchterminal;
            if (message.resolveenterprisecontacts != null && message.hasOwnProperty("resolveenterprisecontacts"))
                object.resolveenterprisecontacts = message.resolveenterprisecontacts;
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.directorynumbersearch != null && message.hasOwnProperty("directorynumbersearch"))
                object.directorynumbersearch = message.directorynumbersearch;
            if (message.subscribecallcontrol != null && message.hasOwnProperty("subscribecallcontrol"))
                object.subscribecallcontrol = message.subscribecallcontrol;
            if (message.subscribecalllog != null && message.hasOwnProperty("subscribecalllog"))
                object.subscribecalllog = message.subscribecalllog;
            return object;
        };
    
        /**
         * Converts this GetCapabilityResponse to JSON.
         * @function toJSON
         * @memberof GetCapabilityResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetCapabilityResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return GetCapabilityResponse;
    })();
    
    $root.Notify = (function() {
    
        /**
         * Properties of a Notify.
         * @exports INotify
         * @interface INotify
         * @property {number|null} [subscribeId] Notify subscribeId
         * @property {number|null} [notifyId] Notify notifyId
         * @property {string|null} [label] Notify label
         * @property {INotifyEquinoxPresence|null} [presence] Notify presence
         * @property {INotifyEquinoxSelf|null} [selfpresence] Notify selfpresence
         * @property {INotifyContacts|null} [contacts] Notify contacts
         * @property {INotifyCallControl|null} [callcontrol] Notify callcontrol
         * @property {INotifyCallLog|null} [calllog] Notify calllog
         */
    
        /**
         * Constructs a new Notify.
         * @exports Notify
         * @classdesc Represents a Notify.
         * @implements INotify
         * @constructor
         * @param {INotify=} [properties] Properties to set
         */
        function Notify(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * Notify subscribeId.
         * @member {number} subscribeId
         * @memberof Notify
         * @instance
         */
        Notify.prototype.subscribeId = 0;
    
        /**
         * Notify notifyId.
         * @member {number} notifyId
         * @memberof Notify
         * @instance
         */
        Notify.prototype.notifyId = 0;
    
        /**
         * Notify label.
         * @member {string} label
         * @memberof Notify
         * @instance
         */
        Notify.prototype.label = "";
    
        /**
         * Notify presence.
         * @member {INotifyEquinoxPresence|null|undefined} presence
         * @memberof Notify
         * @instance
         */
        Notify.prototype.presence = null;
    
        /**
         * Notify selfpresence.
         * @member {INotifyEquinoxSelf|null|undefined} selfpresence
         * @memberof Notify
         * @instance
         */
        Notify.prototype.selfpresence = null;
    
        /**
         * Notify contacts.
         * @member {INotifyContacts|null|undefined} contacts
         * @memberof Notify
         * @instance
         */
        Notify.prototype.contacts = null;
    
        /**
         * Notify callcontrol.
         * @member {INotifyCallControl|null|undefined} callcontrol
         * @memberof Notify
         * @instance
         */
        Notify.prototype.callcontrol = null;
    
        /**
         * Notify calllog.
         * @member {INotifyCallLog|null|undefined} calllog
         * @memberof Notify
         * @instance
         */
        Notify.prototype.calllog = null;
    
        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;
    
        /**
         * Notify payload.
         * @member {"presence"|"selfpresence"|"contacts"|"callcontrol"|"calllog"|undefined} payload
         * @memberof Notify
         * @instance
         */
        Object.defineProperty(Notify.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["presence", "selfpresence", "contacts", "callcontrol", "calllog"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Creates a new Notify instance using the specified properties.
         * @function create
         * @memberof Notify
         * @static
         * @param {INotify=} [properties] Properties to set
         * @returns {Notify} Notify instance
         */
        Notify.create = function create(properties) {
            return new Notify(properties);
        };
    
        /**
         * Encodes the specified Notify message. Does not implicitly {@link Notify.verify|verify} messages.
         * @function encode
         * @memberof Notify
         * @static
         * @param {INotify} message Notify message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Notify.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.subscribeId);
            if (message.notifyId != null && message.hasOwnProperty("notifyId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.notifyId);
            if (message.label != null && message.hasOwnProperty("label"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.label);
            if (message.presence != null && message.hasOwnProperty("presence"))
                $root.NotifyEquinoxPresence.encode(message.presence, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.selfpresence != null && message.hasOwnProperty("selfpresence"))
                $root.NotifyEquinoxSelf.encode(message.selfpresence, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.contacts != null && message.hasOwnProperty("contacts"))
                $root.NotifyContacts.encode(message.contacts, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.callcontrol != null && message.hasOwnProperty("callcontrol"))
                $root.NotifyCallControl.encode(message.callcontrol, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            if (message.calllog != null && message.hasOwnProperty("calllog"))
                $root.NotifyCallLog.encode(message.calllog, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified Notify message, length delimited. Does not implicitly {@link Notify.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Notify
         * @static
         * @param {INotify} message Notify message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Notify.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a Notify message from the specified reader or buffer.
         * @function decode
         * @memberof Notify
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Notify} Notify
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Notify.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Notify();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.subscribeId = reader.int32();
                    break;
                case 2:
                    message.notifyId = reader.int32();
                    break;
                case 3:
                    message.label = reader.string();
                    break;
                case 10:
                    message.presence = $root.NotifyEquinoxPresence.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.selfpresence = $root.NotifyEquinoxSelf.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.contacts = $root.NotifyContacts.decode(reader, reader.uint32());
                    break;
                case 14:
                    message.callcontrol = $root.NotifyCallControl.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.calllog = $root.NotifyCallLog.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a Notify message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Notify
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Notify} Notify
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Notify.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a Notify message.
         * @function verify
         * @memberof Notify
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Notify.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                if (!$util.isInteger(message.subscribeId))
                    return "subscribeId: integer expected";
            if (message.notifyId != null && message.hasOwnProperty("notifyId"))
                if (!$util.isInteger(message.notifyId))
                    return "notifyId: integer expected";
            if (message.label != null && message.hasOwnProperty("label"))
                if (!$util.isString(message.label))
                    return "label: string expected";
            if (message.presence != null && message.hasOwnProperty("presence")) {
                properties.payload = 1;
                {
                    var error = $root.NotifyEquinoxPresence.verify(message.presence);
                    if (error)
                        return "presence." + error;
                }
            }
            if (message.selfpresence != null && message.hasOwnProperty("selfpresence")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.NotifyEquinoxSelf.verify(message.selfpresence);
                    if (error)
                        return "selfpresence." + error;
                }
            }
            if (message.contacts != null && message.hasOwnProperty("contacts")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.NotifyContacts.verify(message.contacts);
                    if (error)
                        return "contacts." + error;
                }
            }
            if (message.callcontrol != null && message.hasOwnProperty("callcontrol")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.NotifyCallControl.verify(message.callcontrol);
                    if (error)
                        return "callcontrol." + error;
                }
            }
            if (message.calllog != null && message.hasOwnProperty("calllog")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.NotifyCallLog.verify(message.calllog);
                    if (error)
                        return "calllog." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a Notify message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Notify
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Notify} Notify
         */
        Notify.fromObject = function fromObject(object) {
            if (object instanceof $root.Notify)
                return object;
            var message = new $root.Notify();
            if (object.subscribeId != null)
                message.subscribeId = object.subscribeId | 0;
            if (object.notifyId != null)
                message.notifyId = object.notifyId | 0;
            if (object.label != null)
                message.label = String(object.label);
            if (object.presence != null) {
                if (typeof object.presence !== "object")
                    throw TypeError(".Notify.presence: object expected");
                message.presence = $root.NotifyEquinoxPresence.fromObject(object.presence);
            }
            if (object.selfpresence != null) {
                if (typeof object.selfpresence !== "object")
                    throw TypeError(".Notify.selfpresence: object expected");
                message.selfpresence = $root.NotifyEquinoxSelf.fromObject(object.selfpresence);
            }
            if (object.contacts != null) {
                if (typeof object.contacts !== "object")
                    throw TypeError(".Notify.contacts: object expected");
                message.contacts = $root.NotifyContacts.fromObject(object.contacts);
            }
            if (object.callcontrol != null) {
                if (typeof object.callcontrol !== "object")
                    throw TypeError(".Notify.callcontrol: object expected");
                message.callcontrol = $root.NotifyCallControl.fromObject(object.callcontrol);
            }
            if (object.calllog != null) {
                if (typeof object.calllog !== "object")
                    throw TypeError(".Notify.calllog: object expected");
                message.calllog = $root.NotifyCallLog.fromObject(object.calllog);
            }
            return message;
        };
    
        /**
         * Creates a plain object from a Notify message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Notify
         * @static
         * @param {Notify} message Notify
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Notify.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.subscribeId = 0;
                object.notifyId = 0;
                object.label = "";
            }
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                object.subscribeId = message.subscribeId;
            if (message.notifyId != null && message.hasOwnProperty("notifyId"))
                object.notifyId = message.notifyId;
            if (message.label != null && message.hasOwnProperty("label"))
                object.label = message.label;
            if (message.presence != null && message.hasOwnProperty("presence")) {
                object.presence = $root.NotifyEquinoxPresence.toObject(message.presence, options);
                if (options.oneofs)
                    object.payload = "presence";
            }
            if (message.selfpresence != null && message.hasOwnProperty("selfpresence")) {
                object.selfpresence = $root.NotifyEquinoxSelf.toObject(message.selfpresence, options);
                if (options.oneofs)
                    object.payload = "selfpresence";
            }
            if (message.contacts != null && message.hasOwnProperty("contacts")) {
                object.contacts = $root.NotifyContacts.toObject(message.contacts, options);
                if (options.oneofs)
                    object.payload = "contacts";
            }
            if (message.callcontrol != null && message.hasOwnProperty("callcontrol")) {
                object.callcontrol = $root.NotifyCallControl.toObject(message.callcontrol, options);
                if (options.oneofs)
                    object.payload = "callcontrol";
            }
            if (message.calllog != null && message.hasOwnProperty("calllog")) {
                object.calllog = $root.NotifyCallLog.toObject(message.calllog, options);
                if (options.oneofs)
                    object.payload = "calllog";
            }
            return object;
        };
    
        /**
         * Converts this Notify to JSON.
         * @function toJSON
         * @memberof Notify
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Notify.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return Notify;
    })();
    
    $root.NotifyAck = (function() {
    
        /**
         * Properties of a NotifyAck.
         * @exports INotifyAck
         * @interface INotifyAck
         * @property {number|null} [subscribeId] NotifyAck subscribeId
         * @property {number|null} [notifyId] NotifyAck notifyId
         */
    
        /**
         * Constructs a new NotifyAck.
         * @exports NotifyAck
         * @classdesc Represents a NotifyAck.
         * @implements INotifyAck
         * @constructor
         * @param {INotifyAck=} [properties] Properties to set
         */
        function NotifyAck(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * NotifyAck subscribeId.
         * @member {number} subscribeId
         * @memberof NotifyAck
         * @instance
         */
        NotifyAck.prototype.subscribeId = 0;
    
        /**
         * NotifyAck notifyId.
         * @member {number} notifyId
         * @memberof NotifyAck
         * @instance
         */
        NotifyAck.prototype.notifyId = 0;
    
        /**
         * Creates a new NotifyAck instance using the specified properties.
         * @function create
         * @memberof NotifyAck
         * @static
         * @param {INotifyAck=} [properties] Properties to set
         * @returns {NotifyAck} NotifyAck instance
         */
        NotifyAck.create = function create(properties) {
            return new NotifyAck(properties);
        };
    
        /**
         * Encodes the specified NotifyAck message. Does not implicitly {@link NotifyAck.verify|verify} messages.
         * @function encode
         * @memberof NotifyAck
         * @static
         * @param {INotifyAck} message NotifyAck message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyAck.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.subscribeId);
            if (message.notifyId != null && message.hasOwnProperty("notifyId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.notifyId);
            return writer;
        };
    
        /**
         * Encodes the specified NotifyAck message, length delimited. Does not implicitly {@link NotifyAck.verify|verify} messages.
         * @function encodeDelimited
         * @memberof NotifyAck
         * @static
         * @param {INotifyAck} message NotifyAck message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NotifyAck.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a NotifyAck message from the specified reader or buffer.
         * @function decode
         * @memberof NotifyAck
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {NotifyAck} NotifyAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyAck.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NotifyAck();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.subscribeId = reader.int32();
                    break;
                case 2:
                    message.notifyId = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a NotifyAck message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof NotifyAck
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {NotifyAck} NotifyAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NotifyAck.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a NotifyAck message.
         * @function verify
         * @memberof NotifyAck
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NotifyAck.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                if (!$util.isInteger(message.subscribeId))
                    return "subscribeId: integer expected";
            if (message.notifyId != null && message.hasOwnProperty("notifyId"))
                if (!$util.isInteger(message.notifyId))
                    return "notifyId: integer expected";
            return null;
        };
    
        /**
         * Creates a NotifyAck message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof NotifyAck
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {NotifyAck} NotifyAck
         */
        NotifyAck.fromObject = function fromObject(object) {
            if (object instanceof $root.NotifyAck)
                return object;
            var message = new $root.NotifyAck();
            if (object.subscribeId != null)
                message.subscribeId = object.subscribeId | 0;
            if (object.notifyId != null)
                message.notifyId = object.notifyId | 0;
            return message;
        };
    
        /**
         * Creates a plain object from a NotifyAck message. Also converts values to other types if specified.
         * @function toObject
         * @memberof NotifyAck
         * @static
         * @param {NotifyAck} message NotifyAck
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NotifyAck.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.subscribeId = 0;
                object.notifyId = 0;
            }
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                object.subscribeId = message.subscribeId;
            if (message.notifyId != null && message.hasOwnProperty("notifyId"))
                object.notifyId = message.notifyId;
            return object;
        };
    
        /**
         * Converts this NotifyAck to JSON.
         * @function toJSON
         * @memberof NotifyAck
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NotifyAck.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return NotifyAck;
    })();
    
    $root.Subscribe = (function() {
    
        /**
         * Properties of a Subscribe.
         * @exports ISubscribe
         * @interface ISubscribe
         * @property {number|null} [requestid] Subscribe requestid
         * @property {number|null} [subscribeId] Subscribe subscribeId
         * @property {number|null} [timeout] Subscribe timeout
         * @property {string|null} [label] Subscribe label
         * @property {ISubscribeEquinoxPresence|null} [presence] Subscribe presence
         * @property {ISubscribeEquinoxSelf|null} [selfpresence] Subscribe selfpresence
         * @property {ISubscribeContacts|null} [contacts] Subscribe contacts
         * @property {ISubscribeCallControl|null} [callcontrol] Subscribe callcontrol
         * @property {ISubscribeCallLog|null} [calllog] Subscribe calllog
         */
    
        /**
         * Constructs a new Subscribe.
         * @exports Subscribe
         * @classdesc Represents a Subscribe.
         * @implements ISubscribe
         * @constructor
         * @param {ISubscribe=} [properties] Properties to set
         */
        function Subscribe(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * Subscribe requestid.
         * @member {number} requestid
         * @memberof Subscribe
         * @instance
         */
        Subscribe.prototype.requestid = 0;
    
        /**
         * Subscribe subscribeId.
         * @member {number} subscribeId
         * @memberof Subscribe
         * @instance
         */
        Subscribe.prototype.subscribeId = 0;
    
        /**
         * Subscribe timeout.
         * @member {number} timeout
         * @memberof Subscribe
         * @instance
         */
        Subscribe.prototype.timeout = 0;
    
        /**
         * Subscribe label.
         * @member {string} label
         * @memberof Subscribe
         * @instance
         */
        Subscribe.prototype.label = "";
    
        /**
         * Subscribe presence.
         * @member {ISubscribeEquinoxPresence|null|undefined} presence
         * @memberof Subscribe
         * @instance
         */
        Subscribe.prototype.presence = null;
    
        /**
         * Subscribe selfpresence.
         * @member {ISubscribeEquinoxSelf|null|undefined} selfpresence
         * @memberof Subscribe
         * @instance
         */
        Subscribe.prototype.selfpresence = null;
    
        /**
         * Subscribe contacts.
         * @member {ISubscribeContacts|null|undefined} contacts
         * @memberof Subscribe
         * @instance
         */
        Subscribe.prototype.contacts = null;
    
        /**
         * Subscribe callcontrol.
         * @member {ISubscribeCallControl|null|undefined} callcontrol
         * @memberof Subscribe
         * @instance
         */
        Subscribe.prototype.callcontrol = null;
    
        /**
         * Subscribe calllog.
         * @member {ISubscribeCallLog|null|undefined} calllog
         * @memberof Subscribe
         * @instance
         */
        Subscribe.prototype.calllog = null;
    
        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;
    
        /**
         * Subscribe payload.
         * @member {"presence"|"selfpresence"|"contacts"|"callcontrol"|"calllog"|undefined} payload
         * @memberof Subscribe
         * @instance
         */
        Object.defineProperty(Subscribe.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["presence", "selfpresence", "contacts", "callcontrol", "calllog"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Creates a new Subscribe instance using the specified properties.
         * @function create
         * @memberof Subscribe
         * @static
         * @param {ISubscribe=} [properties] Properties to set
         * @returns {Subscribe} Subscribe instance
         */
        Subscribe.create = function create(properties) {
            return new Subscribe(properties);
        };
    
        /**
         * Encodes the specified Subscribe message. Does not implicitly {@link Subscribe.verify|verify} messages.
         * @function encode
         * @memberof Subscribe
         * @static
         * @param {ISubscribe} message Subscribe message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Subscribe.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.requestid != null && message.hasOwnProperty("requestid"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.requestid);
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.subscribeId);
            if (message.timeout != null && message.hasOwnProperty("timeout"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.timeout);
            if (message.label != null && message.hasOwnProperty("label"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.label);
            if (message.presence != null && message.hasOwnProperty("presence"))
                $root.SubscribeEquinoxPresence.encode(message.presence, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.selfpresence != null && message.hasOwnProperty("selfpresence"))
                $root.SubscribeEquinoxSelf.encode(message.selfpresence, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.contacts != null && message.hasOwnProperty("contacts"))
                $root.SubscribeContacts.encode(message.contacts, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.callcontrol != null && message.hasOwnProperty("callcontrol"))
                $root.SubscribeCallControl.encode(message.callcontrol, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            if (message.calllog != null && message.hasOwnProperty("calllog"))
                $root.SubscribeCallLog.encode(message.calllog, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified Subscribe message, length delimited. Does not implicitly {@link Subscribe.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Subscribe
         * @static
         * @param {ISubscribe} message Subscribe message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Subscribe.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a Subscribe message from the specified reader or buffer.
         * @function decode
         * @memberof Subscribe
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Subscribe} Subscribe
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Subscribe.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Subscribe();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.requestid = reader.int32();
                    break;
                case 2:
                    message.subscribeId = reader.int32();
                    break;
                case 3:
                    message.timeout = reader.int32();
                    break;
                case 4:
                    message.label = reader.string();
                    break;
                case 10:
                    message.presence = $root.SubscribeEquinoxPresence.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.selfpresence = $root.SubscribeEquinoxSelf.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.contacts = $root.SubscribeContacts.decode(reader, reader.uint32());
                    break;
                case 14:
                    message.callcontrol = $root.SubscribeCallControl.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.calllog = $root.SubscribeCallLog.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a Subscribe message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Subscribe
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Subscribe} Subscribe
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Subscribe.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a Subscribe message.
         * @function verify
         * @memberof Subscribe
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Subscribe.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.requestid != null && message.hasOwnProperty("requestid"))
                if (!$util.isInteger(message.requestid))
                    return "requestid: integer expected";
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                if (!$util.isInteger(message.subscribeId))
                    return "subscribeId: integer expected";
            if (message.timeout != null && message.hasOwnProperty("timeout"))
                if (!$util.isInteger(message.timeout))
                    return "timeout: integer expected";
            if (message.label != null && message.hasOwnProperty("label"))
                if (!$util.isString(message.label))
                    return "label: string expected";
            if (message.presence != null && message.hasOwnProperty("presence")) {
                properties.payload = 1;
                {
                    var error = $root.SubscribeEquinoxPresence.verify(message.presence);
                    if (error)
                        return "presence." + error;
                }
            }
            if (message.selfpresence != null && message.hasOwnProperty("selfpresence")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.SubscribeEquinoxSelf.verify(message.selfpresence);
                    if (error)
                        return "selfpresence." + error;
                }
            }
            if (message.contacts != null && message.hasOwnProperty("contacts")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.SubscribeContacts.verify(message.contacts);
                    if (error)
                        return "contacts." + error;
                }
            }
            if (message.callcontrol != null && message.hasOwnProperty("callcontrol")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.SubscribeCallControl.verify(message.callcontrol);
                    if (error)
                        return "callcontrol." + error;
                }
            }
            if (message.calllog != null && message.hasOwnProperty("calllog")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.SubscribeCallLog.verify(message.calllog);
                    if (error)
                        return "calllog." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a Subscribe message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Subscribe
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Subscribe} Subscribe
         */
        Subscribe.fromObject = function fromObject(object) {
            if (object instanceof $root.Subscribe)
                return object;
            var message = new $root.Subscribe();
            if (object.requestid != null)
                message.requestid = object.requestid | 0;
            if (object.subscribeId != null)
                message.subscribeId = object.subscribeId | 0;
            if (object.timeout != null)
                message.timeout = object.timeout | 0;
            if (object.label != null)
                message.label = String(object.label);
            if (object.presence != null) {
                if (typeof object.presence !== "object")
                    throw TypeError(".Subscribe.presence: object expected");
                message.presence = $root.SubscribeEquinoxPresence.fromObject(object.presence);
            }
            if (object.selfpresence != null) {
                if (typeof object.selfpresence !== "object")
                    throw TypeError(".Subscribe.selfpresence: object expected");
                message.selfpresence = $root.SubscribeEquinoxSelf.fromObject(object.selfpresence);
            }
            if (object.contacts != null) {
                if (typeof object.contacts !== "object")
                    throw TypeError(".Subscribe.contacts: object expected");
                message.contacts = $root.SubscribeContacts.fromObject(object.contacts);
            }
            if (object.callcontrol != null) {
                if (typeof object.callcontrol !== "object")
                    throw TypeError(".Subscribe.callcontrol: object expected");
                message.callcontrol = $root.SubscribeCallControl.fromObject(object.callcontrol);
            }
            if (object.calllog != null) {
                if (typeof object.calllog !== "object")
                    throw TypeError(".Subscribe.calllog: object expected");
                message.calllog = $root.SubscribeCallLog.fromObject(object.calllog);
            }
            return message;
        };
    
        /**
         * Creates a plain object from a Subscribe message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Subscribe
         * @static
         * @param {Subscribe} message Subscribe
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Subscribe.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.requestid = 0;
                object.subscribeId = 0;
                object.timeout = 0;
                object.label = "";
            }
            if (message.requestid != null && message.hasOwnProperty("requestid"))
                object.requestid = message.requestid;
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                object.subscribeId = message.subscribeId;
            if (message.timeout != null && message.hasOwnProperty("timeout"))
                object.timeout = message.timeout;
            if (message.label != null && message.hasOwnProperty("label"))
                object.label = message.label;
            if (message.presence != null && message.hasOwnProperty("presence")) {
                object.presence = $root.SubscribeEquinoxPresence.toObject(message.presence, options);
                if (options.oneofs)
                    object.payload = "presence";
            }
            if (message.selfpresence != null && message.hasOwnProperty("selfpresence")) {
                object.selfpresence = $root.SubscribeEquinoxSelf.toObject(message.selfpresence, options);
                if (options.oneofs)
                    object.payload = "selfpresence";
            }
            if (message.contacts != null && message.hasOwnProperty("contacts")) {
                object.contacts = $root.SubscribeContacts.toObject(message.contacts, options);
                if (options.oneofs)
                    object.payload = "contacts";
            }
            if (message.callcontrol != null && message.hasOwnProperty("callcontrol")) {
                object.callcontrol = $root.SubscribeCallControl.toObject(message.callcontrol, options);
                if (options.oneofs)
                    object.payload = "callcontrol";
            }
            if (message.calllog != null && message.hasOwnProperty("calllog")) {
                object.calllog = $root.SubscribeCallLog.toObject(message.calllog, options);
                if (options.oneofs)
                    object.payload = "calllog";
            }
            return object;
        };
    
        /**
         * Converts this Subscribe to JSON.
         * @function toJSON
         * @memberof Subscribe
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Subscribe.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return Subscribe;
    })();
    
    $root.SubscribeEnd = (function() {
    
        /**
         * Properties of a SubscribeEnd.
         * @exports ISubscribeEnd
         * @interface ISubscribeEnd
         * @property {number|null} [requestid] SubscribeEnd requestid
         * @property {number|null} [subscribeId] SubscribeEnd subscribeId
         * @property {string|null} [reason] SubscribeEnd reason
         */
    
        /**
         * Constructs a new SubscribeEnd.
         * @exports SubscribeEnd
         * @classdesc Represents a SubscribeEnd.
         * @implements ISubscribeEnd
         * @constructor
         * @param {ISubscribeEnd=} [properties] Properties to set
         */
        function SubscribeEnd(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * SubscribeEnd requestid.
         * @member {number} requestid
         * @memberof SubscribeEnd
         * @instance
         */
        SubscribeEnd.prototype.requestid = 0;
    
        /**
         * SubscribeEnd subscribeId.
         * @member {number} subscribeId
         * @memberof SubscribeEnd
         * @instance
         */
        SubscribeEnd.prototype.subscribeId = 0;
    
        /**
         * SubscribeEnd reason.
         * @member {string} reason
         * @memberof SubscribeEnd
         * @instance
         */
        SubscribeEnd.prototype.reason = "";
    
        /**
         * Creates a new SubscribeEnd instance using the specified properties.
         * @function create
         * @memberof SubscribeEnd
         * @static
         * @param {ISubscribeEnd=} [properties] Properties to set
         * @returns {SubscribeEnd} SubscribeEnd instance
         */
        SubscribeEnd.create = function create(properties) {
            return new SubscribeEnd(properties);
        };
    
        /**
         * Encodes the specified SubscribeEnd message. Does not implicitly {@link SubscribeEnd.verify|verify} messages.
         * @function encode
         * @memberof SubscribeEnd
         * @static
         * @param {ISubscribeEnd} message SubscribeEnd message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubscribeEnd.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.requestid != null && message.hasOwnProperty("requestid"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.requestid);
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.subscribeId);
            if (message.reason != null && message.hasOwnProperty("reason"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.reason);
            return writer;
        };
    
        /**
         * Encodes the specified SubscribeEnd message, length delimited. Does not implicitly {@link SubscribeEnd.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SubscribeEnd
         * @static
         * @param {ISubscribeEnd} message SubscribeEnd message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubscribeEnd.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a SubscribeEnd message from the specified reader or buffer.
         * @function decode
         * @memberof SubscribeEnd
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SubscribeEnd} SubscribeEnd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubscribeEnd.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SubscribeEnd();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.requestid = reader.int32();
                    break;
                case 2:
                    message.subscribeId = reader.int32();
                    break;
                case 3:
                    message.reason = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a SubscribeEnd message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SubscribeEnd
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SubscribeEnd} SubscribeEnd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubscribeEnd.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a SubscribeEnd message.
         * @function verify
         * @memberof SubscribeEnd
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SubscribeEnd.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.requestid != null && message.hasOwnProperty("requestid"))
                if (!$util.isInteger(message.requestid))
                    return "requestid: integer expected";
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                if (!$util.isInteger(message.subscribeId))
                    return "subscribeId: integer expected";
            if (message.reason != null && message.hasOwnProperty("reason"))
                if (!$util.isString(message.reason))
                    return "reason: string expected";
            return null;
        };
    
        /**
         * Creates a SubscribeEnd message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SubscribeEnd
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SubscribeEnd} SubscribeEnd
         */
        SubscribeEnd.fromObject = function fromObject(object) {
            if (object instanceof $root.SubscribeEnd)
                return object;
            var message = new $root.SubscribeEnd();
            if (object.requestid != null)
                message.requestid = object.requestid | 0;
            if (object.subscribeId != null)
                message.subscribeId = object.subscribeId | 0;
            if (object.reason != null)
                message.reason = String(object.reason);
            return message;
        };
    
        /**
         * Creates a plain object from a SubscribeEnd message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SubscribeEnd
         * @static
         * @param {SubscribeEnd} message SubscribeEnd
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SubscribeEnd.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.requestid = 0;
                object.subscribeId = 0;
                object.reason = "";
            }
            if (message.requestid != null && message.hasOwnProperty("requestid"))
                object.requestid = message.requestid;
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                object.subscribeId = message.subscribeId;
            if (message.reason != null && message.hasOwnProperty("reason"))
                object.reason = message.reason;
            return object;
        };
    
        /**
         * Converts this SubscribeEnd to JSON.
         * @function toJSON
         * @memberof SubscribeEnd
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SubscribeEnd.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return SubscribeEnd;
    })();
    
    $root.SubscribeTerminated = (function() {
    
        /**
         * Properties of a SubscribeTerminated.
         * @exports ISubscribeTerminated
         * @interface ISubscribeTerminated
         * @property {number|null} [subscribeId] SubscribeTerminated subscribeId
         * @property {string|null} [reason] SubscribeTerminated reason
         */
    
        /**
         * Constructs a new SubscribeTerminated.
         * @exports SubscribeTerminated
         * @classdesc Represents a SubscribeTerminated.
         * @implements ISubscribeTerminated
         * @constructor
         * @param {ISubscribeTerminated=} [properties] Properties to set
         */
        function SubscribeTerminated(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * SubscribeTerminated subscribeId.
         * @member {number} subscribeId
         * @memberof SubscribeTerminated
         * @instance
         */
        SubscribeTerminated.prototype.subscribeId = 0;
    
        /**
         * SubscribeTerminated reason.
         * @member {string} reason
         * @memberof SubscribeTerminated
         * @instance
         */
        SubscribeTerminated.prototype.reason = "";
    
        /**
         * Creates a new SubscribeTerminated instance using the specified properties.
         * @function create
         * @memberof SubscribeTerminated
         * @static
         * @param {ISubscribeTerminated=} [properties] Properties to set
         * @returns {SubscribeTerminated} SubscribeTerminated instance
         */
        SubscribeTerminated.create = function create(properties) {
            return new SubscribeTerminated(properties);
        };
    
        /**
         * Encodes the specified SubscribeTerminated message. Does not implicitly {@link SubscribeTerminated.verify|verify} messages.
         * @function encode
         * @memberof SubscribeTerminated
         * @static
         * @param {ISubscribeTerminated} message SubscribeTerminated message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubscribeTerminated.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.subscribeId);
            if (message.reason != null && message.hasOwnProperty("reason"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.reason);
            return writer;
        };
    
        /**
         * Encodes the specified SubscribeTerminated message, length delimited. Does not implicitly {@link SubscribeTerminated.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SubscribeTerminated
         * @static
         * @param {ISubscribeTerminated} message SubscribeTerminated message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubscribeTerminated.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a SubscribeTerminated message from the specified reader or buffer.
         * @function decode
         * @memberof SubscribeTerminated
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SubscribeTerminated} SubscribeTerminated
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubscribeTerminated.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SubscribeTerminated();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.subscribeId = reader.int32();
                    break;
                case 2:
                    message.reason = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a SubscribeTerminated message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SubscribeTerminated
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SubscribeTerminated} SubscribeTerminated
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubscribeTerminated.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a SubscribeTerminated message.
         * @function verify
         * @memberof SubscribeTerminated
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SubscribeTerminated.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                if (!$util.isInteger(message.subscribeId))
                    return "subscribeId: integer expected";
            if (message.reason != null && message.hasOwnProperty("reason"))
                if (!$util.isString(message.reason))
                    return "reason: string expected";
            return null;
        };
    
        /**
         * Creates a SubscribeTerminated message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SubscribeTerminated
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SubscribeTerminated} SubscribeTerminated
         */
        SubscribeTerminated.fromObject = function fromObject(object) {
            if (object instanceof $root.SubscribeTerminated)
                return object;
            var message = new $root.SubscribeTerminated();
            if (object.subscribeId != null)
                message.subscribeId = object.subscribeId | 0;
            if (object.reason != null)
                message.reason = String(object.reason);
            return message;
        };
    
        /**
         * Creates a plain object from a SubscribeTerminated message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SubscribeTerminated
         * @static
         * @param {SubscribeTerminated} message SubscribeTerminated
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SubscribeTerminated.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.subscribeId = 0;
                object.reason = "";
            }
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                object.subscribeId = message.subscribeId;
            if (message.reason != null && message.hasOwnProperty("reason"))
                object.reason = message.reason;
            return object;
        };
    
        /**
         * Converts this SubscribeTerminated to JSON.
         * @function toJSON
         * @memberof SubscribeTerminated
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SubscribeTerminated.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return SubscribeTerminated;
    })();
    
    $root.SubscribeCmd = (function() {
    
        /**
         * Properties of a SubscribeCmd.
         * @exports ISubscribeCmd
         * @interface ISubscribeCmd
         * @property {number|null} [requestid] SubscribeCmd requestid
         * @property {number|null} [subscribeId] SubscribeCmd subscribeId
         * @property {number|null} [timeout] SubscribeCmd timeout
         * @property {IUpdateEquinoxPresence|null} [presence] SubscribeCmd presence
         * @property {IUpdateEquinoxSelf|null} [selfpresence] SubscribeCmd selfpresence
         * @property {IUpdateContacts|null} [contacts] SubscribeCmd contacts
         * @property {IUpdateCallControl|null} [callcontrol] SubscribeCmd callcontrol
         * @property {IUpdateCallLog|null} [calllog] SubscribeCmd calllog
         */
    
        /**
         * Constructs a new SubscribeCmd.
         * @exports SubscribeCmd
         * @classdesc Represents a SubscribeCmd.
         * @implements ISubscribeCmd
         * @constructor
         * @param {ISubscribeCmd=} [properties] Properties to set
         */
        function SubscribeCmd(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * SubscribeCmd requestid.
         * @member {number} requestid
         * @memberof SubscribeCmd
         * @instance
         */
        SubscribeCmd.prototype.requestid = 0;
    
        /**
         * SubscribeCmd subscribeId.
         * @member {number} subscribeId
         * @memberof SubscribeCmd
         * @instance
         */
        SubscribeCmd.prototype.subscribeId = 0;
    
        /**
         * SubscribeCmd timeout.
         * @member {number} timeout
         * @memberof SubscribeCmd
         * @instance
         */
        SubscribeCmd.prototype.timeout = 0;
    
        /**
         * SubscribeCmd presence.
         * @member {IUpdateEquinoxPresence|null|undefined} presence
         * @memberof SubscribeCmd
         * @instance
         */
        SubscribeCmd.prototype.presence = null;
    
        /**
         * SubscribeCmd selfpresence.
         * @member {IUpdateEquinoxSelf|null|undefined} selfpresence
         * @memberof SubscribeCmd
         * @instance
         */
        SubscribeCmd.prototype.selfpresence = null;
    
        /**
         * SubscribeCmd contacts.
         * @member {IUpdateContacts|null|undefined} contacts
         * @memberof SubscribeCmd
         * @instance
         */
        SubscribeCmd.prototype.contacts = null;
    
        /**
         * SubscribeCmd callcontrol.
         * @member {IUpdateCallControl|null|undefined} callcontrol
         * @memberof SubscribeCmd
         * @instance
         */
        SubscribeCmd.prototype.callcontrol = null;
    
        /**
         * SubscribeCmd calllog.
         * @member {IUpdateCallLog|null|undefined} calllog
         * @memberof SubscribeCmd
         * @instance
         */
        SubscribeCmd.prototype.calllog = null;
    
        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;
    
        /**
         * SubscribeCmd payload.
         * @member {"timeout"|"presence"|"selfpresence"|"contacts"|"callcontrol"|"calllog"|undefined} payload
         * @memberof SubscribeCmd
         * @instance
         */
        Object.defineProperty(SubscribeCmd.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["timeout", "presence", "selfpresence", "contacts", "callcontrol", "calllog"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Creates a new SubscribeCmd instance using the specified properties.
         * @function create
         * @memberof SubscribeCmd
         * @static
         * @param {ISubscribeCmd=} [properties] Properties to set
         * @returns {SubscribeCmd} SubscribeCmd instance
         */
        SubscribeCmd.create = function create(properties) {
            return new SubscribeCmd(properties);
        };
    
        /**
         * Encodes the specified SubscribeCmd message. Does not implicitly {@link SubscribeCmd.verify|verify} messages.
         * @function encode
         * @memberof SubscribeCmd
         * @static
         * @param {ISubscribeCmd} message SubscribeCmd message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubscribeCmd.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.requestid != null && message.hasOwnProperty("requestid"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.requestid);
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.subscribeId);
            if (message.timeout != null && message.hasOwnProperty("timeout"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.timeout);
            if (message.presence != null && message.hasOwnProperty("presence"))
                $root.UpdateEquinoxPresence.encode(message.presence, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.selfpresence != null && message.hasOwnProperty("selfpresence"))
                $root.UpdateEquinoxSelf.encode(message.selfpresence, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.contacts != null && message.hasOwnProperty("contacts"))
                $root.UpdateContacts.encode(message.contacts, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.callcontrol != null && message.hasOwnProperty("callcontrol"))
                $root.UpdateCallControl.encode(message.callcontrol, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            if (message.calllog != null && message.hasOwnProperty("calllog"))
                $root.UpdateCallLog.encode(message.calllog, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified SubscribeCmd message, length delimited. Does not implicitly {@link SubscribeCmd.verify|verify} messages.
         * @function encodeDelimited
         * @memberof SubscribeCmd
         * @static
         * @param {ISubscribeCmd} message SubscribeCmd message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubscribeCmd.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a SubscribeCmd message from the specified reader or buffer.
         * @function decode
         * @memberof SubscribeCmd
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {SubscribeCmd} SubscribeCmd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubscribeCmd.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SubscribeCmd();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.requestid = reader.int32();
                    break;
                case 2:
                    message.subscribeId = reader.int32();
                    break;
                case 3:
                    message.timeout = reader.int32();
                    break;
                case 10:
                    message.presence = $root.UpdateEquinoxPresence.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.selfpresence = $root.UpdateEquinoxSelf.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.contacts = $root.UpdateContacts.decode(reader, reader.uint32());
                    break;
                case 14:
                    message.callcontrol = $root.UpdateCallControl.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.calllog = $root.UpdateCallLog.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a SubscribeCmd message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof SubscribeCmd
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {SubscribeCmd} SubscribeCmd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubscribeCmd.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a SubscribeCmd message.
         * @function verify
         * @memberof SubscribeCmd
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SubscribeCmd.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.requestid != null && message.hasOwnProperty("requestid"))
                if (!$util.isInteger(message.requestid))
                    return "requestid: integer expected";
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                if (!$util.isInteger(message.subscribeId))
                    return "subscribeId: integer expected";
            if (message.timeout != null && message.hasOwnProperty("timeout")) {
                properties.payload = 1;
                if (!$util.isInteger(message.timeout))
                    return "timeout: integer expected";
            }
            if (message.presence != null && message.hasOwnProperty("presence")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.UpdateEquinoxPresence.verify(message.presence);
                    if (error)
                        return "presence." + error;
                }
            }
            if (message.selfpresence != null && message.hasOwnProperty("selfpresence")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.UpdateEquinoxSelf.verify(message.selfpresence);
                    if (error)
                        return "selfpresence." + error;
                }
            }
            if (message.contacts != null && message.hasOwnProperty("contacts")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.UpdateContacts.verify(message.contacts);
                    if (error)
                        return "contacts." + error;
                }
            }
            if (message.callcontrol != null && message.hasOwnProperty("callcontrol")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.UpdateCallControl.verify(message.callcontrol);
                    if (error)
                        return "callcontrol." + error;
                }
            }
            if (message.calllog != null && message.hasOwnProperty("calllog")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.UpdateCallLog.verify(message.calllog);
                    if (error)
                        return "calllog." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a SubscribeCmd message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof SubscribeCmd
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {SubscribeCmd} SubscribeCmd
         */
        SubscribeCmd.fromObject = function fromObject(object) {
            if (object instanceof $root.SubscribeCmd)
                return object;
            var message = new $root.SubscribeCmd();
            if (object.requestid != null)
                message.requestid = object.requestid | 0;
            if (object.subscribeId != null)
                message.subscribeId = object.subscribeId | 0;
            if (object.timeout != null)
                message.timeout = object.timeout | 0;
            if (object.presence != null) {
                if (typeof object.presence !== "object")
                    throw TypeError(".SubscribeCmd.presence: object expected");
                message.presence = $root.UpdateEquinoxPresence.fromObject(object.presence);
            }
            if (object.selfpresence != null) {
                if (typeof object.selfpresence !== "object")
                    throw TypeError(".SubscribeCmd.selfpresence: object expected");
                message.selfpresence = $root.UpdateEquinoxSelf.fromObject(object.selfpresence);
            }
            if (object.contacts != null) {
                if (typeof object.contacts !== "object")
                    throw TypeError(".SubscribeCmd.contacts: object expected");
                message.contacts = $root.UpdateContacts.fromObject(object.contacts);
            }
            if (object.callcontrol != null) {
                if (typeof object.callcontrol !== "object")
                    throw TypeError(".SubscribeCmd.callcontrol: object expected");
                message.callcontrol = $root.UpdateCallControl.fromObject(object.callcontrol);
            }
            if (object.calllog != null) {
                if (typeof object.calllog !== "object")
                    throw TypeError(".SubscribeCmd.calllog: object expected");
                message.calllog = $root.UpdateCallLog.fromObject(object.calllog);
            }
            return message;
        };
    
        /**
         * Creates a plain object from a SubscribeCmd message. Also converts values to other types if specified.
         * @function toObject
         * @memberof SubscribeCmd
         * @static
         * @param {SubscribeCmd} message SubscribeCmd
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SubscribeCmd.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.requestid = 0;
                object.subscribeId = 0;
            }
            if (message.requestid != null && message.hasOwnProperty("requestid"))
                object.requestid = message.requestid;
            if (message.subscribeId != null && message.hasOwnProperty("subscribeId"))
                object.subscribeId = message.subscribeId;
            if (message.timeout != null && message.hasOwnProperty("timeout")) {
                object.timeout = message.timeout;
                if (options.oneofs)
                    object.payload = "timeout";
            }
            if (message.presence != null && message.hasOwnProperty("presence")) {
                object.presence = $root.UpdateEquinoxPresence.toObject(message.presence, options);
                if (options.oneofs)
                    object.payload = "presence";
            }
            if (message.selfpresence != null && message.hasOwnProperty("selfpresence")) {
                object.selfpresence = $root.UpdateEquinoxSelf.toObject(message.selfpresence, options);
                if (options.oneofs)
                    object.payload = "selfpresence";
            }
            if (message.contacts != null && message.hasOwnProperty("contacts")) {
                object.contacts = $root.UpdateContacts.toObject(message.contacts, options);
                if (options.oneofs)
                    object.payload = "contacts";
            }
            if (message.callcontrol != null && message.hasOwnProperty("callcontrol")) {
                object.callcontrol = $root.UpdateCallControl.toObject(message.callcontrol, options);
                if (options.oneofs)
                    object.payload = "callcontrol";
            }
            if (message.calllog != null && message.hasOwnProperty("calllog")) {
                object.calllog = $root.UpdateCallLog.toObject(message.calllog, options);
                if (options.oneofs)
                    object.payload = "calllog";
            }
            return object;
        };
    
        /**
         * Converts this SubscribeCmd to JSON.
         * @function toJSON
         * @memberof SubscribeCmd
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SubscribeCmd.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return SubscribeCmd;
    })();
    
    $root.RequestResponse = (function() {
    
        /**
         * Properties of a RequestResponse.
         * @exports IRequestResponse
         * @interface IRequestResponse
         * @property {number|null} [requestid] RequestResponse requestid
         * @property {number|null} [result] RequestResponse result
         * @property {string|null} [additional] RequestResponse additional
         */
    
        /**
         * Constructs a new RequestResponse.
         * @exports RequestResponse
         * @classdesc Represents a RequestResponse.
         * @implements IRequestResponse
         * @constructor
         * @param {IRequestResponse=} [properties] Properties to set
         */
        function RequestResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * RequestResponse requestid.
         * @member {number} requestid
         * @memberof RequestResponse
         * @instance
         */
        RequestResponse.prototype.requestid = 0;
    
        /**
         * RequestResponse result.
         * @member {number} result
         * @memberof RequestResponse
         * @instance
         */
        RequestResponse.prototype.result = 0;
    
        /**
         * RequestResponse additional.
         * @member {string} additional
         * @memberof RequestResponse
         * @instance
         */
        RequestResponse.prototype.additional = "";
    
        /**
         * Creates a new RequestResponse instance using the specified properties.
         * @function create
         * @memberof RequestResponse
         * @static
         * @param {IRequestResponse=} [properties] Properties to set
         * @returns {RequestResponse} RequestResponse instance
         */
        RequestResponse.create = function create(properties) {
            return new RequestResponse(properties);
        };
    
        /**
         * Encodes the specified RequestResponse message. Does not implicitly {@link RequestResponse.verify|verify} messages.
         * @function encode
         * @memberof RequestResponse
         * @static
         * @param {IRequestResponse} message RequestResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RequestResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.requestid != null && message.hasOwnProperty("requestid"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.requestid);
            if (message.result != null && message.hasOwnProperty("result"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.result);
            if (message.additional != null && message.hasOwnProperty("additional"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.additional);
            return writer;
        };
    
        /**
         * Encodes the specified RequestResponse message, length delimited. Does not implicitly {@link RequestResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof RequestResponse
         * @static
         * @param {IRequestResponse} message RequestResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RequestResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a RequestResponse message from the specified reader or buffer.
         * @function decode
         * @memberof RequestResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {RequestResponse} RequestResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RequestResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RequestResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.requestid = reader.int32();
                    break;
                case 2:
                    message.result = reader.int32();
                    break;
                case 3:
                    message.additional = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a RequestResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof RequestResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {RequestResponse} RequestResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RequestResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a RequestResponse message.
         * @function verify
         * @memberof RequestResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RequestResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.requestid != null && message.hasOwnProperty("requestid"))
                if (!$util.isInteger(message.requestid))
                    return "requestid: integer expected";
            if (message.result != null && message.hasOwnProperty("result"))
                if (!$util.isInteger(message.result))
                    return "result: integer expected";
            if (message.additional != null && message.hasOwnProperty("additional"))
                if (!$util.isString(message.additional))
                    return "additional: string expected";
            return null;
        };
    
        /**
         * Creates a RequestResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof RequestResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {RequestResponse} RequestResponse
         */
        RequestResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.RequestResponse)
                return object;
            var message = new $root.RequestResponse();
            if (object.requestid != null)
                message.requestid = object.requestid | 0;
            if (object.result != null)
                message.result = object.result | 0;
            if (object.additional != null)
                message.additional = String(object.additional);
            return message;
        };
    
        /**
         * Creates a plain object from a RequestResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof RequestResponse
         * @static
         * @param {RequestResponse} message RequestResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RequestResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.requestid = 0;
                object.result = 0;
                object.additional = "";
            }
            if (message.requestid != null && message.hasOwnProperty("requestid"))
                object.requestid = message.requestid;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = message.result;
            if (message.additional != null && message.hasOwnProperty("additional"))
                object.additional = message.additional;
            return object;
        };
    
        /**
         * Converts this RequestResponse to JSON.
         * @function toJSON
         * @memberof RequestResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RequestResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return RequestResponse;
    })();
    
    $root.GeneralCmdStatus = (function() {
    
        /**
         * Properties of a GeneralCmdStatus.
         * @exports IGeneralCmdStatus
         * @interface IGeneralCmdStatus
         * @property {number|null} [cmdinst] GeneralCmdStatus cmdinst
         * @property {number|null} [result] GeneralCmdStatus result
         * @property {string|null} [additional] GeneralCmdStatus additional
         */
    
        /**
         * Constructs a new GeneralCmdStatus.
         * @exports GeneralCmdStatus
         * @classdesc Represents a GeneralCmdStatus.
         * @implements IGeneralCmdStatus
         * @constructor
         * @param {IGeneralCmdStatus=} [properties] Properties to set
         */
        function GeneralCmdStatus(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * GeneralCmdStatus cmdinst.
         * @member {number} cmdinst
         * @memberof GeneralCmdStatus
         * @instance
         */
        GeneralCmdStatus.prototype.cmdinst = 0;
    
        /**
         * GeneralCmdStatus result.
         * @member {number} result
         * @memberof GeneralCmdStatus
         * @instance
         */
        GeneralCmdStatus.prototype.result = 0;
    
        /**
         * GeneralCmdStatus additional.
         * @member {string} additional
         * @memberof GeneralCmdStatus
         * @instance
         */
        GeneralCmdStatus.prototype.additional = "";
    
        /**
         * Creates a new GeneralCmdStatus instance using the specified properties.
         * @function create
         * @memberof GeneralCmdStatus
         * @static
         * @param {IGeneralCmdStatus=} [properties] Properties to set
         * @returns {GeneralCmdStatus} GeneralCmdStatus instance
         */
        GeneralCmdStatus.create = function create(properties) {
            return new GeneralCmdStatus(properties);
        };
    
        /**
         * Encodes the specified GeneralCmdStatus message. Does not implicitly {@link GeneralCmdStatus.verify|verify} messages.
         * @function encode
         * @memberof GeneralCmdStatus
         * @static
         * @param {IGeneralCmdStatus} message GeneralCmdStatus message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GeneralCmdStatus.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cmdinst);
            if (message.result != null && message.hasOwnProperty("result"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.result);
            if (message.additional != null && message.hasOwnProperty("additional"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.additional);
            return writer;
        };
    
        /**
         * Encodes the specified GeneralCmdStatus message, length delimited. Does not implicitly {@link GeneralCmdStatus.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GeneralCmdStatus
         * @static
         * @param {IGeneralCmdStatus} message GeneralCmdStatus message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GeneralCmdStatus.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a GeneralCmdStatus message from the specified reader or buffer.
         * @function decode
         * @memberof GeneralCmdStatus
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GeneralCmdStatus} GeneralCmdStatus
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GeneralCmdStatus.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GeneralCmdStatus();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cmdinst = reader.int32();
                    break;
                case 2:
                    message.result = reader.int32();
                    break;
                case 3:
                    message.additional = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a GeneralCmdStatus message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GeneralCmdStatus
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GeneralCmdStatus} GeneralCmdStatus
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GeneralCmdStatus.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a GeneralCmdStatus message.
         * @function verify
         * @memberof GeneralCmdStatus
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GeneralCmdStatus.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                if (!$util.isInteger(message.cmdinst))
                    return "cmdinst: integer expected";
            if (message.result != null && message.hasOwnProperty("result"))
                if (!$util.isInteger(message.result))
                    return "result: integer expected";
            if (message.additional != null && message.hasOwnProperty("additional"))
                if (!$util.isString(message.additional))
                    return "additional: string expected";
            return null;
        };
    
        /**
         * Creates a GeneralCmdStatus message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GeneralCmdStatus
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GeneralCmdStatus} GeneralCmdStatus
         */
        GeneralCmdStatus.fromObject = function fromObject(object) {
            if (object instanceof $root.GeneralCmdStatus)
                return object;
            var message = new $root.GeneralCmdStatus();
            if (object.cmdinst != null)
                message.cmdinst = object.cmdinst | 0;
            if (object.result != null)
                message.result = object.result | 0;
            if (object.additional != null)
                message.additional = String(object.additional);
            return message;
        };
    
        /**
         * Creates a plain object from a GeneralCmdStatus message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GeneralCmdStatus
         * @static
         * @param {GeneralCmdStatus} message GeneralCmdStatus
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GeneralCmdStatus.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cmdinst = 0;
                object.result = 0;
                object.additional = "";
            }
            if (message.cmdinst != null && message.hasOwnProperty("cmdinst"))
                object.cmdinst = message.cmdinst;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = message.result;
            if (message.additional != null && message.hasOwnProperty("additional"))
                object.additional = message.additional;
            return object;
        };
    
        /**
         * Converts this GeneralCmdStatus to JSON.
         * @function toJSON
         * @memberof GeneralCmdStatus
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GeneralCmdStatus.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return GeneralCmdStatus;
    })();
    
    $root.GeneralCmd = (function() {
    
        /**
         * Properties of a GeneralCmd.
         * @exports IGeneralCmd
         * @interface IGeneralCmd
         * @property {number|null} [requestid] GeneralCmd requestid
         * @property {IGetDirectory|null} [directory] GeneralCmd directory
         * @property {IGetCapability|null} [capability] GeneralCmd capability
         * @property {IGetContact|null} [contact] GeneralCmd contact
         */
    
        /**
         * Constructs a new GeneralCmd.
         * @exports GeneralCmd
         * @classdesc Represents a GeneralCmd.
         * @implements IGeneralCmd
         * @constructor
         * @param {IGeneralCmd=} [properties] Properties to set
         */
        function GeneralCmd(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * GeneralCmd requestid.
         * @member {number} requestid
         * @memberof GeneralCmd
         * @instance
         */
        GeneralCmd.prototype.requestid = 0;
    
        /**
         * GeneralCmd directory.
         * @member {IGetDirectory|null|undefined} directory
         * @memberof GeneralCmd
         * @instance
         */
        GeneralCmd.prototype.directory = null;
    
        /**
         * GeneralCmd capability.
         * @member {IGetCapability|null|undefined} capability
         * @memberof GeneralCmd
         * @instance
         */
        GeneralCmd.prototype.capability = null;
    
        /**
         * GeneralCmd contact.
         * @member {IGetContact|null|undefined} contact
         * @memberof GeneralCmd
         * @instance
         */
        GeneralCmd.prototype.contact = null;
    
        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;
    
        /**
         * GeneralCmd payload.
         * @member {"directory"|"capability"|"contact"|undefined} payload
         * @memberof GeneralCmd
         * @instance
         */
        Object.defineProperty(GeneralCmd.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["directory", "capability", "contact"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Creates a new GeneralCmd instance using the specified properties.
         * @function create
         * @memberof GeneralCmd
         * @static
         * @param {IGeneralCmd=} [properties] Properties to set
         * @returns {GeneralCmd} GeneralCmd instance
         */
        GeneralCmd.create = function create(properties) {
            return new GeneralCmd(properties);
        };
    
        /**
         * Encodes the specified GeneralCmd message. Does not implicitly {@link GeneralCmd.verify|verify} messages.
         * @function encode
         * @memberof GeneralCmd
         * @static
         * @param {IGeneralCmd} message GeneralCmd message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GeneralCmd.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.requestid != null && message.hasOwnProperty("requestid"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.requestid);
            if (message.directory != null && message.hasOwnProperty("directory"))
                $root.GetDirectory.encode(message.directory, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.capability != null && message.hasOwnProperty("capability"))
                $root.GetCapability.encode(message.capability, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.contact != null && message.hasOwnProperty("contact"))
                $root.GetContact.encode(message.contact, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified GeneralCmd message, length delimited. Does not implicitly {@link GeneralCmd.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GeneralCmd
         * @static
         * @param {IGeneralCmd} message GeneralCmd message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GeneralCmd.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a GeneralCmd message from the specified reader or buffer.
         * @function decode
         * @memberof GeneralCmd
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GeneralCmd} GeneralCmd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GeneralCmd.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GeneralCmd();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.requestid = reader.int32();
                    break;
                case 2:
                    message.directory = $root.GetDirectory.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.capability = $root.GetCapability.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.contact = $root.GetContact.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a GeneralCmd message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GeneralCmd
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GeneralCmd} GeneralCmd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GeneralCmd.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a GeneralCmd message.
         * @function verify
         * @memberof GeneralCmd
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GeneralCmd.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.requestid != null && message.hasOwnProperty("requestid"))
                if (!$util.isInteger(message.requestid))
                    return "requestid: integer expected";
            if (message.directory != null && message.hasOwnProperty("directory")) {
                properties.payload = 1;
                {
                    var error = $root.GetDirectory.verify(message.directory);
                    if (error)
                        return "directory." + error;
                }
            }
            if (message.capability != null && message.hasOwnProperty("capability")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.GetCapability.verify(message.capability);
                    if (error)
                        return "capability." + error;
                }
            }
            if (message.contact != null && message.hasOwnProperty("contact")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.GetContact.verify(message.contact);
                    if (error)
                        return "contact." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a GeneralCmd message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GeneralCmd
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GeneralCmd} GeneralCmd
         */
        GeneralCmd.fromObject = function fromObject(object) {
            if (object instanceof $root.GeneralCmd)
                return object;
            var message = new $root.GeneralCmd();
            if (object.requestid != null)
                message.requestid = object.requestid | 0;
            if (object.directory != null) {
                if (typeof object.directory !== "object")
                    throw TypeError(".GeneralCmd.directory: object expected");
                message.directory = $root.GetDirectory.fromObject(object.directory);
            }
            if (object.capability != null) {
                if (typeof object.capability !== "object")
                    throw TypeError(".GeneralCmd.capability: object expected");
                message.capability = $root.GetCapability.fromObject(object.capability);
            }
            if (object.contact != null) {
                if (typeof object.contact !== "object")
                    throw TypeError(".GeneralCmd.contact: object expected");
                message.contact = $root.GetContact.fromObject(object.contact);
            }
            return message;
        };
    
        /**
         * Creates a plain object from a GeneralCmd message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GeneralCmd
         * @static
         * @param {GeneralCmd} message GeneralCmd
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GeneralCmd.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.requestid = 0;
            if (message.requestid != null && message.hasOwnProperty("requestid"))
                object.requestid = message.requestid;
            if (message.directory != null && message.hasOwnProperty("directory")) {
                object.directory = $root.GetDirectory.toObject(message.directory, options);
                if (options.oneofs)
                    object.payload = "directory";
            }
            if (message.capability != null && message.hasOwnProperty("capability")) {
                object.capability = $root.GetCapability.toObject(message.capability, options);
                if (options.oneofs)
                    object.payload = "capability";
            }
            if (message.contact != null && message.hasOwnProperty("contact")) {
                object.contact = $root.GetContact.toObject(message.contact, options);
                if (options.oneofs)
                    object.payload = "contact";
            }
            return object;
        };
    
        /**
         * Converts this GeneralCmd to JSON.
         * @function toJSON
         * @memberof GeneralCmd
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GeneralCmd.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return GeneralCmd;
    })();
    
    $root.GeneralData = (function() {
    
        /**
         * Properties of a GeneralData.
         * @exports IGeneralData
         * @interface IGeneralData
         * @property {number|null} [responseid] GeneralData responseid
         * @property {IGetDirectoryResponse|null} [directory] GeneralData directory
         * @property {IGetCapabilityResponse|null} [capability] GeneralData capability
         * @property {IGetContactResponse|null} [contact] GeneralData contact
         * @property {IGeneralCmdStatus|null} [status] GeneralData status
         */
    
        /**
         * Constructs a new GeneralData.
         * @exports GeneralData
         * @classdesc Represents a GeneralData.
         * @implements IGeneralData
         * @constructor
         * @param {IGeneralData=} [properties] Properties to set
         */
        function GeneralData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * GeneralData responseid.
         * @member {number} responseid
         * @memberof GeneralData
         * @instance
         */
        GeneralData.prototype.responseid = 0;
    
        /**
         * GeneralData directory.
         * @member {IGetDirectoryResponse|null|undefined} directory
         * @memberof GeneralData
         * @instance
         */
        GeneralData.prototype.directory = null;
    
        /**
         * GeneralData capability.
         * @member {IGetCapabilityResponse|null|undefined} capability
         * @memberof GeneralData
         * @instance
         */
        GeneralData.prototype.capability = null;
    
        /**
         * GeneralData contact.
         * @member {IGetContactResponse|null|undefined} contact
         * @memberof GeneralData
         * @instance
         */
        GeneralData.prototype.contact = null;
    
        /**
         * GeneralData status.
         * @member {IGeneralCmdStatus|null|undefined} status
         * @memberof GeneralData
         * @instance
         */
        GeneralData.prototype.status = null;
    
        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;
    
        /**
         * GeneralData payload.
         * @member {"directory"|"capability"|"contact"|"status"|undefined} payload
         * @memberof GeneralData
         * @instance
         */
        Object.defineProperty(GeneralData.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["directory", "capability", "contact", "status"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Creates a new GeneralData instance using the specified properties.
         * @function create
         * @memberof GeneralData
         * @static
         * @param {IGeneralData=} [properties] Properties to set
         * @returns {GeneralData} GeneralData instance
         */
        GeneralData.create = function create(properties) {
            return new GeneralData(properties);
        };
    
        /**
         * Encodes the specified GeneralData message. Does not implicitly {@link GeneralData.verify|verify} messages.
         * @function encode
         * @memberof GeneralData
         * @static
         * @param {IGeneralData} message GeneralData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GeneralData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.responseid != null && message.hasOwnProperty("responseid"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.responseid);
            if (message.directory != null && message.hasOwnProperty("directory"))
                $root.GetDirectoryResponse.encode(message.directory, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.capability != null && message.hasOwnProperty("capability"))
                $root.GetCapabilityResponse.encode(message.capability, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.contact != null && message.hasOwnProperty("contact"))
                $root.GetContactResponse.encode(message.contact, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.status != null && message.hasOwnProperty("status"))
                $root.GeneralCmdStatus.encode(message.status, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified GeneralData message, length delimited. Does not implicitly {@link GeneralData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof GeneralData
         * @static
         * @param {IGeneralData} message GeneralData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GeneralData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a GeneralData message from the specified reader or buffer.
         * @function decode
         * @memberof GeneralData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {GeneralData} GeneralData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GeneralData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GeneralData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.responseid = reader.int32();
                    break;
                case 2:
                    message.directory = $root.GetDirectoryResponse.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.capability = $root.GetCapabilityResponse.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.contact = $root.GetContactResponse.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.status = $root.GeneralCmdStatus.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a GeneralData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof GeneralData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {GeneralData} GeneralData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GeneralData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a GeneralData message.
         * @function verify
         * @memberof GeneralData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GeneralData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.responseid != null && message.hasOwnProperty("responseid"))
                if (!$util.isInteger(message.responseid))
                    return "responseid: integer expected";
            if (message.directory != null && message.hasOwnProperty("directory")) {
                properties.payload = 1;
                {
                    var error = $root.GetDirectoryResponse.verify(message.directory);
                    if (error)
                        return "directory." + error;
                }
            }
            if (message.capability != null && message.hasOwnProperty("capability")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.GetCapabilityResponse.verify(message.capability);
                    if (error)
                        return "capability." + error;
                }
            }
            if (message.contact != null && message.hasOwnProperty("contact")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.GetContactResponse.verify(message.contact);
                    if (error)
                        return "contact." + error;
                }
            }
            if (message.status != null && message.hasOwnProperty("status")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.GeneralCmdStatus.verify(message.status);
                    if (error)
                        return "status." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a GeneralData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof GeneralData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {GeneralData} GeneralData
         */
        GeneralData.fromObject = function fromObject(object) {
            if (object instanceof $root.GeneralData)
                return object;
            var message = new $root.GeneralData();
            if (object.responseid != null)
                message.responseid = object.responseid | 0;
            if (object.directory != null) {
                if (typeof object.directory !== "object")
                    throw TypeError(".GeneralData.directory: object expected");
                message.directory = $root.GetDirectoryResponse.fromObject(object.directory);
            }
            if (object.capability != null) {
                if (typeof object.capability !== "object")
                    throw TypeError(".GeneralData.capability: object expected");
                message.capability = $root.GetCapabilityResponse.fromObject(object.capability);
            }
            if (object.contact != null) {
                if (typeof object.contact !== "object")
                    throw TypeError(".GeneralData.contact: object expected");
                message.contact = $root.GetContactResponse.fromObject(object.contact);
            }
            if (object.status != null) {
                if (typeof object.status !== "object")
                    throw TypeError(".GeneralData.status: object expected");
                message.status = $root.GeneralCmdStatus.fromObject(object.status);
            }
            return message;
        };
    
        /**
         * Creates a plain object from a GeneralData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof GeneralData
         * @static
         * @param {GeneralData} message GeneralData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GeneralData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.responseid = 0;
            if (message.responseid != null && message.hasOwnProperty("responseid"))
                object.responseid = message.responseid;
            if (message.directory != null && message.hasOwnProperty("directory")) {
                object.directory = $root.GetDirectoryResponse.toObject(message.directory, options);
                if (options.oneofs)
                    object.payload = "directory";
            }
            if (message.capability != null && message.hasOwnProperty("capability")) {
                object.capability = $root.GetCapabilityResponse.toObject(message.capability, options);
                if (options.oneofs)
                    object.payload = "capability";
            }
            if (message.contact != null && message.hasOwnProperty("contact")) {
                object.contact = $root.GetContactResponse.toObject(message.contact, options);
                if (options.oneofs)
                    object.payload = "contact";
            }
            if (message.status != null && message.hasOwnProperty("status")) {
                object.status = $root.GeneralCmdStatus.toObject(message.status, options);
                if (options.oneofs)
                    object.payload = "status";
            }
            return object;
        };
    
        /**
         * Converts this GeneralData to JSON.
         * @function toJSON
         * @memberof GeneralData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GeneralData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return GeneralData;
    })();
    
    $root.Message = (function() {
    
        /**
         * Properties of a Message.
         * @exports IMessage
         * @interface IMessage
         * @property {IRequestResponse|null} [response] Message response
         * @property {IGeneralCmd|null} [generalcmd] Message generalcmd
         * @property {ISubscribe|null} [subscribe] Message subscribe
         * @property {ISubscribeCmd|null} [subscibecmd] Message subscibecmd
         * @property {ISubscribeEnd|null} [subscribeend] Message subscribeend
         * @property {ISubscribeTerminated|null} [subscribeterminated] Message subscribeterminated
         * @property {IGeneralData|null} [generaldata] Message generaldata
         * @property {INotify|null} [notify] Message notify
         * @property {INotifyAck|null} [notifyack] Message notifyack
         */
    
        /**
         * Constructs a new Message.
         * @exports Message
         * @classdesc Represents a Message.
         * @implements IMessage
         * @constructor
         * @param {IMessage=} [properties] Properties to set
         */
        function Message(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * Message response.
         * @member {IRequestResponse|null|undefined} response
         * @memberof Message
         * @instance
         */
        Message.prototype.response = null;
    
        /**
         * Message generalcmd.
         * @member {IGeneralCmd|null|undefined} generalcmd
         * @memberof Message
         * @instance
         */
        Message.prototype.generalcmd = null;
    
        /**
         * Message subscribe.
         * @member {ISubscribe|null|undefined} subscribe
         * @memberof Message
         * @instance
         */
        Message.prototype.subscribe = null;
    
        /**
         * Message subscibecmd.
         * @member {ISubscribeCmd|null|undefined} subscibecmd
         * @memberof Message
         * @instance
         */
        Message.prototype.subscibecmd = null;
    
        /**
         * Message subscribeend.
         * @member {ISubscribeEnd|null|undefined} subscribeend
         * @memberof Message
         * @instance
         */
        Message.prototype.subscribeend = null;
    
        /**
         * Message subscribeterminated.
         * @member {ISubscribeTerminated|null|undefined} subscribeterminated
         * @memberof Message
         * @instance
         */
        Message.prototype.subscribeterminated = null;
    
        /**
         * Message generaldata.
         * @member {IGeneralData|null|undefined} generaldata
         * @memberof Message
         * @instance
         */
        Message.prototype.generaldata = null;
    
        /**
         * Message notify.
         * @member {INotify|null|undefined} notify
         * @memberof Message
         * @instance
         */
        Message.prototype.notify = null;
    
        /**
         * Message notifyack.
         * @member {INotifyAck|null|undefined} notifyack
         * @memberof Message
         * @instance
         */
        Message.prototype.notifyack = null;
    
        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;
    
        /**
         * Message payload.
         * @member {"response"|"generalcmd"|"subscribe"|"subscibecmd"|"subscribeend"|"subscribeterminated"|"generaldata"|"notify"|"notifyack"|undefined} payload
         * @memberof Message
         * @instance
         */
        Object.defineProperty(Message.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["response", "generalcmd", "subscribe", "subscibecmd", "subscribeend", "subscribeterminated", "generaldata", "notify", "notifyack"]),
            set: $util.oneOfSetter($oneOfFields)
        });
    
        /**
         * Creates a new Message instance using the specified properties.
         * @function create
         * @memberof Message
         * @static
         * @param {IMessage=} [properties] Properties to set
         * @returns {Message} Message instance
         */
        Message.create = function create(properties) {
            return new Message(properties);
        };
    
        /**
         * Encodes the specified Message message. Does not implicitly {@link Message.verify|verify} messages.
         * @function encode
         * @memberof Message
         * @static
         * @param {IMessage} message Message message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.response != null && message.hasOwnProperty("response"))
                $root.RequestResponse.encode(message.response, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.generalcmd != null && message.hasOwnProperty("generalcmd"))
                $root.GeneralCmd.encode(message.generalcmd, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.subscribe != null && message.hasOwnProperty("subscribe"))
                $root.Subscribe.encode(message.subscribe, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.subscibecmd != null && message.hasOwnProperty("subscibecmd"))
                $root.SubscribeCmd.encode(message.subscibecmd, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.subscribeend != null && message.hasOwnProperty("subscribeend"))
                $root.SubscribeEnd.encode(message.subscribeend, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.subscribeterminated != null && message.hasOwnProperty("subscribeterminated"))
                $root.SubscribeTerminated.encode(message.subscribeterminated, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.generaldata != null && message.hasOwnProperty("generaldata"))
                $root.GeneralData.encode(message.generaldata, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.notify != null && message.hasOwnProperty("notify"))
                $root.Notify.encode(message.notify, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.notifyack != null && message.hasOwnProperty("notifyack"))
                $root.NotifyAck.encode(message.notifyack, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            return writer;
        };
    
        /**
         * Encodes the specified Message message, length delimited. Does not implicitly {@link Message.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Message
         * @static
         * @param {IMessage} message Message message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a Message message from the specified reader or buffer.
         * @function decode
         * @memberof Message
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Message} Message
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Message();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.response = $root.RequestResponse.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.generalcmd = $root.GeneralCmd.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.subscribe = $root.Subscribe.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.subscibecmd = $root.SubscribeCmd.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.subscribeend = $root.SubscribeEnd.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.subscribeterminated = $root.SubscribeTerminated.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.generaldata = $root.GeneralData.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.notify = $root.Notify.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.notifyack = $root.NotifyAck.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a Message message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Message
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Message} Message
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a Message message.
         * @function verify
         * @memberof Message
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.response != null && message.hasOwnProperty("response")) {
                properties.payload = 1;
                {
                    var error = $root.RequestResponse.verify(message.response);
                    if (error)
                        return "response." + error;
                }
            }
            if (message.generalcmd != null && message.hasOwnProperty("generalcmd")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.GeneralCmd.verify(message.generalcmd);
                    if (error)
                        return "generalcmd." + error;
                }
            }
            if (message.subscribe != null && message.hasOwnProperty("subscribe")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.Subscribe.verify(message.subscribe);
                    if (error)
                        return "subscribe." + error;
                }
            }
            if (message.subscibecmd != null && message.hasOwnProperty("subscibecmd")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.SubscribeCmd.verify(message.subscibecmd);
                    if (error)
                        return "subscibecmd." + error;
                }
            }
            if (message.subscribeend != null && message.hasOwnProperty("subscribeend")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.SubscribeEnd.verify(message.subscribeend);
                    if (error)
                        return "subscribeend." + error;
                }
            }
            if (message.subscribeterminated != null && message.hasOwnProperty("subscribeterminated")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.SubscribeTerminated.verify(message.subscribeterminated);
                    if (error)
                        return "subscribeterminated." + error;
                }
            }
            if (message.generaldata != null && message.hasOwnProperty("generaldata")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.GeneralData.verify(message.generaldata);
                    if (error)
                        return "generaldata." + error;
                }
            }
            if (message.notify != null && message.hasOwnProperty("notify")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.Notify.verify(message.notify);
                    if (error)
                        return "notify." + error;
                }
            }
            if (message.notifyack != null && message.hasOwnProperty("notifyack")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.NotifyAck.verify(message.notifyack);
                    if (error)
                        return "notifyack." + error;
                }
            }
            return null;
        };
    
        /**
         * Creates a Message message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Message
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Message} Message
         */
        Message.fromObject = function fromObject(object) {
            if (object instanceof $root.Message)
                return object;
            var message = new $root.Message();
            if (object.response != null) {
                if (typeof object.response !== "object")
                    throw TypeError(".Message.response: object expected");
                message.response = $root.RequestResponse.fromObject(object.response);
            }
            if (object.generalcmd != null) {
                if (typeof object.generalcmd !== "object")
                    throw TypeError(".Message.generalcmd: object expected");
                message.generalcmd = $root.GeneralCmd.fromObject(object.generalcmd);
            }
            if (object.subscribe != null) {
                if (typeof object.subscribe !== "object")
                    throw TypeError(".Message.subscribe: object expected");
                message.subscribe = $root.Subscribe.fromObject(object.subscribe);
            }
            if (object.subscibecmd != null) {
                if (typeof object.subscibecmd !== "object")
                    throw TypeError(".Message.subscibecmd: object expected");
                message.subscibecmd = $root.SubscribeCmd.fromObject(object.subscibecmd);
            }
            if (object.subscribeend != null) {
                if (typeof object.subscribeend !== "object")
                    throw TypeError(".Message.subscribeend: object expected");
                message.subscribeend = $root.SubscribeEnd.fromObject(object.subscribeend);
            }
            if (object.subscribeterminated != null) {
                if (typeof object.subscribeterminated !== "object")
                    throw TypeError(".Message.subscribeterminated: object expected");
                message.subscribeterminated = $root.SubscribeTerminated.fromObject(object.subscribeterminated);
            }
            if (object.generaldata != null) {
                if (typeof object.generaldata !== "object")
                    throw TypeError(".Message.generaldata: object expected");
                message.generaldata = $root.GeneralData.fromObject(object.generaldata);
            }
            if (object.notify != null) {
                if (typeof object.notify !== "object")
                    throw TypeError(".Message.notify: object expected");
                message.notify = $root.Notify.fromObject(object.notify);
            }
            if (object.notifyack != null) {
                if (typeof object.notifyack !== "object")
                    throw TypeError(".Message.notifyack: object expected");
                message.notifyack = $root.NotifyAck.fromObject(object.notifyack);
            }
            return message;
        };
    
        /**
         * Creates a plain object from a Message message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Message
         * @static
         * @param {Message} message Message
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (message.response != null && message.hasOwnProperty("response")) {
                object.response = $root.RequestResponse.toObject(message.response, options);
                if (options.oneofs)
                    object.payload = "response";
            }
            if (message.generalcmd != null && message.hasOwnProperty("generalcmd")) {
                object.generalcmd = $root.GeneralCmd.toObject(message.generalcmd, options);
                if (options.oneofs)
                    object.payload = "generalcmd";
            }
            if (message.subscribe != null && message.hasOwnProperty("subscribe")) {
                object.subscribe = $root.Subscribe.toObject(message.subscribe, options);
                if (options.oneofs)
                    object.payload = "subscribe";
            }
            if (message.subscibecmd != null && message.hasOwnProperty("subscibecmd")) {
                object.subscibecmd = $root.SubscribeCmd.toObject(message.subscibecmd, options);
                if (options.oneofs)
                    object.payload = "subscibecmd";
            }
            if (message.subscribeend != null && message.hasOwnProperty("subscribeend")) {
                object.subscribeend = $root.SubscribeEnd.toObject(message.subscribeend, options);
                if (options.oneofs)
                    object.payload = "subscribeend";
            }
            if (message.subscribeterminated != null && message.hasOwnProperty("subscribeterminated")) {
                object.subscribeterminated = $root.SubscribeTerminated.toObject(message.subscribeterminated, options);
                if (options.oneofs)
                    object.payload = "subscribeterminated";
            }
            if (message.generaldata != null && message.hasOwnProperty("generaldata")) {
                object.generaldata = $root.GeneralData.toObject(message.generaldata, options);
                if (options.oneofs)
                    object.payload = "generaldata";
            }
            if (message.notify != null && message.hasOwnProperty("notify")) {
                object.notify = $root.Notify.toObject(message.notify, options);
                if (options.oneofs)
                    object.payload = "notify";
            }
            if (message.notifyack != null && message.hasOwnProperty("notifyack")) {
                object.notifyack = $root.NotifyAck.toObject(message.notifyack, options);
                if (options.oneofs)
                    object.payload = "notifyack";
            }
            return object;
        };
    
        /**
         * Converts this Message to JSON.
         * @function toJSON
         * @memberof Message
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return Message;
    })();

    return $root;
})(protobuf);
