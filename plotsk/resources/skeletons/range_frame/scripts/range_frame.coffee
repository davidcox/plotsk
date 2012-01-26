
class RangeFramePlot
    
    @plot_div   # the div where the plot will display
    @data       # structured object containing data to display
    @p          # parameters controlling the appearance of the plot
    
    constructor: (@plot_div) ->
        @data = null
        @p = null
    
    # clear the plot
    clear: ->
        @svg_container.remove() if @svg_container

    # render the plot
    render: ->
        if (@data == null) or (@p == null)
            console.log('Data or parameters not yet received')
            return
            
        @clear()
        
        # TODO: do this right; a bit convoluted as is...
        @plot_width = $('#' + @plot_div.attr('id')).width()
        @plot_height = $('#' + @plot_div.attr('id')).height()
        
        # Data extents
        [@data_min_x, @data_max_x, @data_min_y, @data_max_y] = @dataExtents()

        for v in [@data_min_x, @data_max_x, @data_min_y, @data_max_y]
            console.log(v)
        console.log(@plot_height)
        console.log(@plot_width)

        # Adjust the min and max according to data pad factors
        # TODO: allow manual setting of these values
        x_span = @data_max_x - @data_min_x;
        y_span = @data_max_y - @data_min_y;
        x_span_pad = (@p.x_data_pad_factor - 1.0) * x_span / 2.0
        y_span_pad = (@p.y_data_pad_factor - 1.0) * y_span / 2.0
        @data_min_x -= x_span_pad
        @data_max_x += x_span_pad
        @data_min_y -= y_span_pad
        @data_max_y += y_span_pad
        
        
        # total offsets to data area
        @data_area_offset_x = @p.ext_pad_x +  # plot-wide x padding
                              @p.tick_gutter_x + # space for tick labels
                              @p.rf_major_x + # size of "major" ticks
                              @p.rf_pad_x # padding btwn frame and data area
        @data_area_offset_y = @p.ext_pad_y + @p.tick_gutter_y + 
                              @p.rf_major_y + @p.rf_pad_y

        # Linear mapping functions (TODO: log, etc.)
        @x_scale = d3.scale.linear()
                           .domain([@data_min_x, @data_max_x])
                           .range([@data_area_offset_x, 
                                   @plot_width - 2*@p.ext_pad_x])
        @y_scale = d3.scale.linear()
                            .domain([@data_min_y, @data_max_y])
                            .range([@plot_height - @data_area_offset_y, 
                                    @p.ext_pad_y])

        # Basic container for the SVG
        @svg_container = @plot_div.append('svg:svg')
                                  .attr('id', 'plot')
                                  .attr('width', '100%')
                                  .attr('height', '100%')

        
        # Render plot parts
        @renderGrid()
        @renderHorizontalRangeFrame()
        @renderVerticalRangeFrame()
        @renderData()
    
    
     # Min and max x and y values, across all data
    dataExtents: ->

        min_x = Infinity
        max_x = -Infinity
        min_y = Infinity
        max_y = -Infinity
        
        for l in @p.lines.concat(@p.points)
            x_data = @data[l.abscissa]
            y_data = @data[l.ordinate]
            
            tmp_min_x = d3.min(x_data.values)
            tmp_max_x = d3.max(x_data.values)
            tmp_min_y = d3.min(y_data.values)
            tmp_max_y = d3.max(y_data.values)
            
            min_x = tmp_min_x if tmp_min_x < min_x
            max_x = tmp_max_x if tmp_max_x > max_x
            min_y = tmp_min_y if tmp_min_y < min_y
            max_y = tmp_max_y if tmp_max_y > max_y
            
        return [min_x, max_x, min_y, max_y]
    
    
    renderGrid: ->
        grid_area = @svg_container.append('svg:g')
                                  .attr('width', '100%')
                                  .attr('class', 'grid')

        # Vertical grid lines
        vgrid = grid_area.selectAll('g.vgrid')
            .data(@x_scale.ticks(@p.n_x_ticks))
            .enter().append('svg:g')
                    .attr('class', 'rule');

        vgrid.append('svg:line')
            .attr('x1', @x_scale)
            .attr('x2', @x_scale)
            .attr('y1', @y_scale(@data_min_y))
            .attr('y2', @y_scale(@data_max_y));

        # Horizontal grid lines / rules
        hgrid = grid_area.selectAll('g.hgrid')
            .data(@y_scale.ticks(@p.n_y_ticks))
            .enter().append('svg:g')
                    .attr('class', 'rule');

        # horizontal grid lines
        hgrid.append('svg:line')
            .attr('y1', @y_scale)
            .attr('y2', @y_scale)
            .attr('x1', @x_scale(@data_min_x))
            .attr('x2', @x_scale(@data_max_x));


    renderVerticalRangeFrame: ->

        y_range_frame = @svg_container.append('svg:g')
                                      .attr('class', 'vertical_range_frame')

        # Determine ticks
        min_y_tick = d3.min(@y_scale.ticks(@p.n_y_ticks))
        max_y_tick = d3.max(@y_scale.ticks(@p.n_y_ticks))

        # Determine starting offsets
        y_frame_start_x = @data_area_offset_x - @p.rf_pad_x
        y_frame_text_start_x = y_frame_start_x - @p.tick_gutter_x

        # vertical line
        y_range_frame.append('svg:line')
                     .attr('class', 'range_frame')
                     .attr('y1', @y_scale(min_y_tick))
                     .attr('y2', @y_scale(max_y_tick))
                     .attr('x1', y_frame_start_x)
                     .attr('x2', y_frame_start_x)

        # ticks
        y_ticks = y_range_frame.selectAll('g.tick')
            .data(@y_scale.ticks(@p.n_y_ticks))
          .enter().append('svg:g')
            .attr('class', 'range_frame')

        y_ticks.append('svg:line')
            .attr('class', (d) => 
                if(d == min_y_tick or d == max_y_tick)
                    return 'major_tick'
                else
                    return 'minor_tick'
            )
            .attr('x1', y_frame_start_x)
            .attr('x2', (d) =>
                if(d == min_y_tick or d == max_y_tick)
                    return y_frame_start_x - @p.rf_major_y
                else
                    return y_frame_start_x - @p.rf_minor_y
            )
            .attr('y1', @y_scale)
            .attr('y2', @y_scale)

        y_tick_labels = y_range_frame.selectAll('g.tick_labels')
            .data(@y_scale.ticks(@p.n_y_ticks))
          .enter().append('svg:text')
            .attr('y', @y_scale)
            .attr('x', y_frame_text_start_x)
            .attr('dy', '.35em')
            .attr('text-anchor', 'end')
            .attr('class', 'tick_label')
            .text(@y_scale.tickFormat(@p.n_y_ticks));


    renderHorizontalRangeFrame: ->

        x_range_frame = @svg_container.append('svg:g')
                                      .attr('class', 'horizontal_range_frame')

        min_x_tick = d3.min(@x_scale.ticks(@p.n_x_ticks))
        max_x_tick = d3.max(@x_scale.ticks(@p.n_x_ticks))

        x_frame_start_y = @plot_height - @data_area_offset_y + @p.rf_pad_y
        x_frame_text_start_y = x_frame_start_y + @p.tick_gutter_y

        # vertical line
        x_range_frame.append('svg:line')
            .attr('class', 'range_frame')
            .attr('y1', x_frame_start_y)
            .attr('y2', x_frame_start_y)
            .attr('x1', @x_scale(min_x_tick))
            .attr('x2', @x_scale(max_x_tick))

        # ticks
        x_ticks = x_range_frame.selectAll('g.tick')
            .data(@x_scale.ticks(@p.n_x_ticks))
          .enter().append('svg:g')
            .attr('class', 'range_frame')

        x_ticks.append('svg:line')
            .attr('class', (d) =>
                if(d == min_x_tick or d == max_x_tick)
                    return 'major_tick'
                else
                    return 'minor_tick'
            )
            .attr('y1', x_frame_start_y)
            .attr('y2', (d) =>
                if(d == min_x_tick or d == max_x_tick)
                    return x_frame_start_y + @p.rf_major_x
                else
                    return x_frame_start_y + @p.rf_minor_x
            )
            .attr('x1', @x_scale)
            .attr('x2', @x_scale)


        x_tick_labels = x_range_frame.selectAll('g.tick_labels')
            .data(@x_scale.ticks(@p.n_x_ticks))
            .enter().append('svg:text')
                .attr('x', @x_scale)
                .attr('y', x_frame_text_start_y)
                .attr('dy', '0.7em')
                .attr('dx', '1em')
                .attr('text-anchor', 'end')
                .attr('class', 'tick_label')
                .text(@x_scale.tickFormat(@p.n_x_ticks));

       
    renderData: ->

        data_area = @svg_container.append('svg:g')
            .attr('width', '100%')
            .attr('class', 'data_area')

        l_id = -1
        for line in @p.lines
            l_id += 1
            zipped_data = d3.zip(@data[line.abscissa].values, 
                                 @data[line.ordinate].values)
                        
            line_cls = 'line'
            line_cls += ' ' + line['css_class'] if line['css_class']
            
            @plotSeries(data_area, zipped_data, line_cls, true)

        p_id = -1
        for pts in @p.points
            p_id += 1
            zipped_data = d3.zip(@data[pts.abscissa].values, 
                                 @data[pts.ordinate].values)
            
            pts_cls = 'points'
            pts_cls += ' ' + pts['css_class'] if pts['css_class']
            
            @plotSeries(data_area, zipped_data, pts_cls, false)

    plotSeries: (data_area, zipped_data, cls, plot_line) ->
            
        if plot_line
            # Line plot
            data_area.append('svg:path')
                .data([zipped_data])
                .attr('class', cls)
                .attr('d', d3.svg.line()
                                 .x((d) => @x_scale(d[0]))
                                 .y((d) => @y_scale(d[1])))
            

        # Scatter plot (effectively)
        data_area.selectAll('circle#' + "data_element_#{cls}")
            .data(zipped_data)
            .enter().append('svg:circle')
                .attr('class', cls)
                .attr('cx', (d) => @x_scale(d[0]))
                .attr('cy', (d) => @y_scale(d[1]))
                .attr('r', 3.5)

# Attach the class to the global window object to make it accessible from
# outside
window.RFPlot = (div) -> return new RangeFramePlot(div)       