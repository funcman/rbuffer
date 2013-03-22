;(function(exports){

    function RingBuffer(size) {
        this.buffer_ = new Buffer(size);
        this.size_ = size;
        this.pos_ = 0;
        this.len_ = 0;
    };

    RingBuffer.prototype = {
        constructor:RingBuffer,

        size:function() {
            return this.size_;
        },

        postion:function() {
            return this.pos_;
        },

        length:function() {
            return this.len_;
        },

        isFull:function() {
            return this.len_ === this.size_;
        },

        increase:function(size) {
            var s = size + this.size_;
            var newbuf = new Buffer(s);
            if( this.pos_ + this.len_ <= this.size_ ) {
                this.buffer_.copy(newbuf, 0, this.pos_, this.pos_+this.len_);
            }else {
                this.buffer_.copy(newbuf, 0, this.pos_);
                this.buffer_.copy(newbuf, this.size_-this.pos_, 0, this.len_-this.size_+this.pos_);
            }
            this.buffer_ = newbuf;
            this.pos_ = 0;
            this.size_ = s;
        },

        deq:function(buffer, size) {
            if( size > this.len_ )
                return false;
            if( this.pos_+size <= this.size_ ) {
                this.buffer_.copy(buffer, 0, this.pos_, this.pos_+size);
            }else {
                this.buffer_.copy(buffer, 0, this.pos_);
                this.buffer_.copy(buffer, this.size_-this.pos_, 0, size-this.size_+this.pos_);
            }
            this.pos_ = this.pos_+size<this.size_ ? this.pos_+size : this.pos_+size-this.size_;
            this.len_ -= size;
            return true;
        },

        enq:function(buffer) {
            var size = buffer.length;
            if( this.len_+size > this.size_ )
                return false;
            if( this.pos_+this.len_ < this.size_ ) {
                if( this.pos_+this.len_+size <= this.size_ ) {
                    buffer.copy(this.buffer_, this.pos_+this.len_);
                }else {
                    buffer.copy(this.buffer_, this.pos_+this.len_, 0, this.size_-this.pos_-this.len_);
                    buffer.copy(this.buffer_, 0, this.size_-this.pos_-this.len_);
                }
            }else {
                buffer.copy(this.buffer_, this.pos_+this.len_-this.size_);
            }
            this.len_ += size;
            return true;
        },
    };

    RingBuffer.uid = 0;

    function hide(obj, prop) {
        if (Object.defineProperty) {
            Object.defineProperty(obj, prop, {enumerable:false});
        }
    };

    exports.RingBuffer = RingBuffer;

})( this.exports || this );

