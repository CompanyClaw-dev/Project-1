import numpy as np
from manim import *

class TrigPlot(Scene):
    def construct(self):
        axes = Axes(
            x_range=[-np.pi, np.pi, np.pi/4],
            y_range=[-1.5, 1.5, 1],
            unit_size=2,
            color=WHITE
        )
        self.add(axes)

        graph_sin = axes.plot(
            lambda x: np.sin(x),
            x_range=[-np.pi, np.pi],
            color=RED,
        )
        graph_cos = axes.plot(
            lambda x: np.cos(x),
            x_range=[-np.pi, np.pi],
            color=BLUE,
        )
        area = axes.get_area(
            graph_sin,
            bounded_graph=graph_cos,
            x_range=[-np.pi, np.pi],
            color=GREEN,
            opacity=0.5
        )
        self.play(
            Create(axes),
            Create(graph_sin),
            Create(graph_cos),
            FadeIn(area),
        )
        self.wait(2)