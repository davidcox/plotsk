(function() {
  var RangeFramePlot;

  RangeFramePlot = (function() {

    RangeFramePlot.plot_div;

    RangeFramePlot.data;

    RangeFramePlot.p;

    function RangeFramePlot(plot_div) {
      this.plot_div = plot_div;
      this.data = null;
      this.p = null;
    }

    RangeFramePlot.prototype.clear = function() {
      if (this.svg_container) return this.svg_container.remove();
    };

    RangeFramePlot.prototype.render = function() {
      var v, x_span, x_span_pad, y_span, y_span_pad, _i, _len, _ref, _ref2;
      if ((this.data === null) || (this.p === null)) {
        console.log('Data or parameters not yet received');
        return;
      }
      this.clear();
      this.plot_width = $('#' + this.plot_div.attr('id')).width();
      this.plot_height = $('#' + this.plot_div.attr('id')).height();
      _ref = this.dataExtents(), this.data_min_x = _ref[0], this.data_max_x = _ref[1], this.data_min_y = _ref[2], this.data_max_y = _ref[3];
      _ref2 = [this.data_min_x, this.data_max_x, this.data_min_y, this.data_max_y];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        v = _ref2[_i];
        console.log(v);
      }
      console.log(this.plot_height);
      console.log(this.plot_width);
      x_span = this.data_max_x - this.data_min_x;
      y_span = this.data_max_y - this.data_min_y;
      x_span_pad = (this.p.x_data_pad_factor - 1.0) * x_span / 2.0;
      y_span_pad = (this.p.y_data_pad_factor - 1.0) * y_span / 2.0;
      this.data_min_x -= x_span_pad;
      this.data_max_x += x_span_pad;
      this.data_min_y -= y_span_pad;
      this.data_max_y += y_span_pad;
      this.data_area_offset_x = this.p.ext_pad_x + this.p.tick_gutter_x + this.p.rf_major_x + this.p.rf_pad_x;
      this.data_area_offset_y = this.p.ext_pad_y + this.p.tick_gutter_y + this.p.rf_major_y + this.p.rf_pad_y;
      this.x_scale = d3.scale.linear().domain([this.data_min_x, this.data_max_x]).range([this.data_area_offset_x, this.plot_width - 2 * this.p.ext_pad_x]);
      this.y_scale = d3.scale.linear().domain([this.data_min_y, this.data_max_y]).range([this.plot_height - this.data_area_offset_y, this.p.ext_pad_y]);
      this.svg_container = this.plot_div.append('svg:svg').attr('id', 'plot').attr('width', '100%').attr('height', '100%');
      this.renderGrid();
      this.renderHorizontalRangeFrame();
      this.renderVerticalRangeFrame();
      return this.renderData();
    };

    RangeFramePlot.prototype.dataExtents = function() {
      var l, max_x, max_y, min_x, min_y, tmp_max_x, tmp_max_y, tmp_min_x, tmp_min_y, x_data, y_data, _i, _len, _ref;
      min_x = Infinity;
      max_x = -Infinity;
      min_y = Infinity;
      max_y = -Infinity;
      _ref = this.p.lines.concat(this.p.points);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        x_data = this.data[l.abscissa];
        y_data = this.data[l.ordinate];
        tmp_min_x = d3.min(x_data.values);
        tmp_max_x = d3.max(x_data.values);
        tmp_min_y = d3.min(y_data.values);
        tmp_max_y = d3.max(y_data.values);
        if (tmp_min_x < min_x) min_x = tmp_min_x;
        if (tmp_max_x > max_x) max_x = tmp_max_x;
        if (tmp_min_y < min_y) min_y = tmp_min_y;
        if (tmp_max_y > max_y) max_y = tmp_max_y;
      }
      return [min_x, max_x, min_y, max_y];
    };

    RangeFramePlot.prototype.renderGrid = function() {
      var grid_area, hgrid, vgrid;
      grid_area = this.svg_container.append('svg:g').attr('width', '100%').attr('class', 'grid');
      vgrid = grid_area.selectAll('g.vgrid').data(this.x_scale.ticks(this.p.n_x_ticks)).enter().append('svg:g').attr('class', 'rule');
      vgrid.append('svg:line').attr('x1', this.x_scale).attr('x2', this.x_scale).attr('y1', this.y_scale(this.data_min_y)).attr('y2', this.y_scale(this.data_max_y));
      hgrid = grid_area.selectAll('g.hgrid').data(this.y_scale.ticks(this.p.n_y_ticks)).enter().append('svg:g').attr('class', 'rule');
      return hgrid.append('svg:line').attr('y1', this.y_scale).attr('y2', this.y_scale).attr('x1', this.x_scale(this.data_min_x)).attr('x2', this.x_scale(this.data_max_x));
    };

    RangeFramePlot.prototype.renderVerticalRangeFrame = function() {
      var max_y_tick, min_y_tick, y_frame_start_x, y_frame_text_start_x, y_range_frame, y_tick_labels, y_ticks,
        _this = this;
      y_range_frame = this.svg_container.append('svg:g').attr('class', 'vertical_range_frame');
      min_y_tick = d3.min(this.y_scale.ticks(this.p.n_y_ticks));
      max_y_tick = d3.max(this.y_scale.ticks(this.p.n_y_ticks));
      y_frame_start_x = this.data_area_offset_x - this.p.rf_pad_x;
      y_frame_text_start_x = y_frame_start_x - this.p.tick_gutter_x;
      y_range_frame.append('svg:line').attr('class', 'range_frame').attr('y1', this.y_scale(min_y_tick)).attr('y2', this.y_scale(max_y_tick)).attr('x1', y_frame_start_x).attr('x2', y_frame_start_x);
      y_ticks = y_range_frame.selectAll('g.tick').data(this.y_scale.ticks(this.p.n_y_ticks)).enter().append('svg:g').attr('class', 'range_frame');
      y_ticks.append('svg:line').attr('class', function(d) {
        if (d === min_y_tick || d === max_y_tick) {
          return 'major_tick';
        } else {
          return 'minor_tick';
        }
      }).attr('x1', y_frame_start_x).attr('x2', function(d) {
        if (d === min_y_tick || d === max_y_tick) {
          return y_frame_start_x - _this.p.rf_major_y;
        } else {
          return y_frame_start_x - _this.p.rf_minor_y;
        }
      }).attr('y1', this.y_scale).attr('y2', this.y_scale);
      return y_tick_labels = y_range_frame.selectAll('g.tick_labels').data(this.y_scale.ticks(this.p.n_y_ticks)).enter().append('svg:text').attr('y', this.y_scale).attr('x', y_frame_text_start_x).attr('dy', '.35em').attr('text-anchor', 'end').attr('class', 'tick_label').text(this.y_scale.tickFormat(this.p.n_y_ticks));
    };

    RangeFramePlot.prototype.renderHorizontalRangeFrame = function() {
      var max_x_tick, min_x_tick, x_frame_start_y, x_frame_text_start_y, x_range_frame, x_tick_labels, x_ticks,
        _this = this;
      x_range_frame = this.svg_container.append('svg:g').attr('class', 'horizontal_range_frame');
      min_x_tick = d3.min(this.x_scale.ticks(this.p.n_x_ticks));
      max_x_tick = d3.max(this.x_scale.ticks(this.p.n_x_ticks));
      x_frame_start_y = this.plot_height - this.data_area_offset_y + this.p.rf_pad_y;
      x_frame_text_start_y = x_frame_start_y + this.p.tick_gutter_y;
      x_range_frame.append('svg:line').attr('class', 'range_frame').attr('y1', x_frame_start_y).attr('y2', x_frame_start_y).attr('x1', this.x_scale(min_x_tick)).attr('x2', this.x_scale(max_x_tick));
      x_ticks = x_range_frame.selectAll('g.tick').data(this.x_scale.ticks(this.p.n_x_ticks)).enter().append('svg:g').attr('class', 'range_frame');
      x_ticks.append('svg:line').attr('class', function(d) {
        if (d === min_x_tick || d === max_x_tick) {
          return 'major_tick';
        } else {
          return 'minor_tick';
        }
      }).attr('y1', x_frame_start_y).attr('y2', function(d) {
        if (d === min_x_tick || d === max_x_tick) {
          return x_frame_start_y + _this.p.rf_major_x;
        } else {
          return x_frame_start_y + _this.p.rf_minor_x;
        }
      }).attr('x1', this.x_scale).attr('x2', this.x_scale);
      return x_tick_labels = x_range_frame.selectAll('g.tick_labels').data(this.x_scale.ticks(this.p.n_x_ticks)).enter().append('svg:text').attr('x', this.x_scale).attr('y', x_frame_text_start_y).attr('dy', '0.7em').attr('dx', '1em').attr('text-anchor', 'end').attr('class', 'tick_label').text(this.x_scale.tickFormat(this.p.n_x_ticks));
    };

    RangeFramePlot.prototype.renderData = function() {
      var data_area, l_id, line, line_cls, p_id, pts, pts_cls, zipped_data, _i, _j, _len, _len2, _ref, _ref2, _results;
      data_area = this.svg_container.append('svg:g').attr('width', '100%').attr('class', 'data_area');
      l_id = -1;
      _ref = this.p.lines;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        l_id += 1;
        zipped_data = d3.zip(this.data[line.abscissa].values, this.data[line.ordinate].values);
        line_cls = 'line';
        if (line['css_class']) line_cls += ' ' + line['css_class'];
        this.plotSeries(data_area, zipped_data, line_cls, true);
      }
      p_id = -1;
      _ref2 = this.p.points;
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        pts = _ref2[_j];
        p_id += 1;
        zipped_data = d3.zip(this.data[pts.abscissa].values, this.data[pts.ordinate].values);
        pts_cls = 'points';
        if (pts['css_class']) pts_cls += ' ' + pts['css_class'];
        _results.push(this.plotSeries(data_area, zipped_data, pts_cls, false));
      }
      return _results;
    };

    RangeFramePlot.prototype.plotSeries = function(data_area, zipped_data, cls, plot_line) {
      var _this = this;
      if (plot_line) {
        data_area.append('svg:path').data([zipped_data]).attr('class', cls).attr('d', d3.svg.line().x(function(d) {
          return _this.x_scale(d[0]);
        }).y(function(d) {
          return _this.y_scale(d[1]);
        }));
      }
      return data_area.selectAll('circle#' + ("data_element_" + cls)).data(zipped_data).enter().append('svg:circle').attr('class', cls).attr('cx', function(d) {
        return _this.x_scale(d[0]);
      }).attr('cy', function(d) {
        return _this.y_scale(d[1]);
      }).attr('r', 3.5);
    };

    return RangeFramePlot;

  })();

  window.RFPlot = function(div) {
    return new RangeFramePlot(div);
  };

}).call(this);
